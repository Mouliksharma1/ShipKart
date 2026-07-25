"use server";

import { db } from "@/lib/db";
import { generateNextDispatchNumber } from "@/lib/services/dispatch-number";
import { BookingStatus, DispatchStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type DispatchActionResult = {
  success: boolean;
  message?: string;
  dispatchNumber?: string;
  dispatchId?: string;
  error?: string;
};

// Valid initial loading statuses for an LR
const LOADABLE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.BOOKED,
  BookingStatus.RECEIVED_AT_ORIGIN,
  BookingStatus.RECEIVED_AT_ORIGIN_OFFICE,
  BookingStatus.SORTED,
];

/**
 * 1. CREATE DISPATCH RUN (Atomic Transaction)
 * Uses auto-generated DSP000000001 dispatch number.
 */
export async function createDispatchAction(data: {
  originOfficeId: string;
  destinationOfficeId: string;
  vehicleNumber: string;
  driverName?: string;
  driverPhone?: string;
  routeId?: string;
  initialLrNumbers?: string[];
  userId?: string;
  userRole?: Role;
}): Promise<DispatchActionResult> {
  // Permission Check: EMPLOYEE, PARTNER_OFFICE, ADMIN
  if (data.userRole && data.userRole === Role.CUSTOMER) {
    return { success: false, error: "Unauthorized. Customer accounts cannot create dispatches." };
  }

  try {
    const result = await db.$transaction(async (tx) => {
      // Auto-generate monotonic DSP dispatch number
      const dispatchNumber = await generateNextDispatchNumber();

      // Create Dispatch record
      const dispatch = await tx.dispatch.create({
        data: {
          dispatchNumber,
          vehicleNumber: data.vehicleNumber.trim().toUpperCase(),
          driverName: data.driverName?.trim() || null,
          driverPhone: data.driverPhone?.trim() || null,
          originOfficeId: data.originOfficeId,
          destinationOfficeId: data.destinationOfficeId,
          routeId: data.routeId || null,
          status: DispatchStatus.CREATED,
        },
      });

      // Initial LR Loading if provided
      if (data.initialLrNumbers && data.initialLrNumbers.length > 0) {
        const cleanLrNumbers = Array.from(new Set(data.initialLrNumbers.map((lr) => lr.trim().toUpperCase())));

        // Validate bookings
        const bookings = await tx.booking.findMany({
          where: { lrNumber: { in: cleanLrNumbers } },
          include: {
            dispatchItems: {
              include: { dispatch: true },
            },
          },
        });

        if (bookings.length !== cleanLrNumbers.length) {
          const foundLrs = new Set(bookings.map((b) => b.lrNumber));
          const missingLrs = cleanLrNumbers.filter((lr) => !foundLrs.has(lr));
          throw new Error(`The following LR numbers were not found: ${missingLrs.join(", ")}`);
        }

        for (const booking of bookings) {
          // Directive 3: Prevent duplicate active dispatch loading
          const activeDispatchItem = booking.dispatchItems.find((di) =>
            ([DispatchStatus.CREATED, DispatchStatus.READY, DispatchStatus.DEPARTED] as DispatchStatus[]).includes(di.dispatch.status)
          );
          if (activeDispatchItem) {
            throw new Error(`LR ${booking.lrNumber} is already attached to active dispatch ${activeDispatchItem.dispatch.dispatchNumber}`);
          }

          // Directive 3: Loadable status check
          if (!LOADABLE_BOOKING_STATUSES.includes(booking.status)) {
            throw new Error(`LR ${booking.lrNumber} cannot be loaded (Current status: ${booking.status})`);
          }

          // Create DispatchItem link
          await tx.dispatchItem.create({
            data: {
              dispatchId: dispatch.id,
              bookingId: booking.id,
            },
          });

          // Update Booking status & current dispatch link
          await tx.booking.update({
            where: { id: booking.id },
            data: {
              dispatchId: dispatch.id,
              status: BookingStatus.LOADED,
              lastUpdatedBy: data.userId || "SYSTEM",
              lastUpdatedAt: new Date(),
            },
          });

          // Create TrackingHistory entry
          await tx.trackingHistory.create({
            data: {
              bookingId: booking.id,
              dispatchId: dispatch.id,
              status: BookingStatus.LOADED,
              title: `Loaded onto Vehicle ${dispatch.vehicleNumber}`,
              publicRemarks: `Consignment loaded onto Vehicle ${dispatch.vehicleNumber} (Manifest ${dispatch.dispatchNumber})`,
              internalRemarks: `Dispatch ID: ${dispatch.id}, Vehicle: ${dispatch.vehicleNumber}`,
              officeId: data.originOfficeId,
              userId: data.userId || null,
            },
          });
        }
      }

      // Log Activity Log
      await tx.activityLog.create({
        data: {
          userId: data.userId || null,
          action: `CREATE_DISPATCH: ${dispatch.dispatchNumber} (${data.vehicleNumber})`,
        },
      });

      return dispatch;
    }, { maxWait: 15000, timeout: 30000 });

    revalidatePath("/employee/dispatches");
    return {
      success: true,
      dispatchNumber: result.dispatchNumber,
      dispatchId: result.id,
      message: `Dispatch ${result.dispatchNumber} created successfully`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create dispatch" };
  }
}

/**
 * 2. BULK LOAD LRs TO DISPATCH (Atomic Transaction)
 * Uses SK LR Numbers, prevents duplicates, checks loadable status, and respects dispatch locking.
 */
export async function loadBookingsToDispatchAction(data: {
  dispatchNumber: string;
  lrNumbers: string[];
  userId?: string;
  userRole?: Role;
}): Promise<DispatchActionResult> {
  if (data.userRole && data.userRole === Role.CUSTOMER) {
    return { success: false, error: "Unauthorized operation." };
  }

  if (!data.lrNumbers || data.lrNumbers.length === 0) {
    return { success: false, error: "No LR numbers provided for loading." };
  }

  const cleanLrNumbers = Array.from(new Set(data.lrNumbers.map((lr) => lr.trim().toUpperCase())));

  try {
    const result = await db.$transaction(async (tx) => {
      // Find Dispatch by public DSP Number
      const dispatch = await tx.dispatch.findUnique({
        where: { dispatchNumber: data.dispatchNumber },
      });

      if (!dispatch) {
        throw new Error(`Dispatch ${data.dispatchNumber} not found.`);
      }

      // Directive 4: Dispatch Locking (Post-Departure is Read-Only)
      if (([DispatchStatus.DEPARTED, DispatchStatus.ARRIVED, DispatchStatus.CLOSED, DispatchStatus.CANCELLED] as DispatchStatus[]).includes(dispatch.status)) {
        throw new Error(`Dispatch ${dispatch.dispatchNumber} is locked (${dispatch.status}). Loading is not permitted after departure.`);
      }

      const bookings = await tx.booking.findMany({
        where: { lrNumber: { in: cleanLrNumbers } },
        include: {
          dispatchItems: {
            include: { dispatch: true },
          },
        },
      });

      if (bookings.length !== cleanLrNumbers.length) {
        const foundLrs = new Set(bookings.map((b) => b.lrNumber));
        const missingLrs = cleanLrNumbers.filter((lr) => !foundLrs.has(lr));
        throw new Error(`The following LR numbers were not found: ${missingLrs.join(", ")}`);
      }

      for (const booking of bookings) {
        // Directive 3: Prevent duplicate active dispatch loading
        const activeDispatchItem = booking.dispatchItems.find(
          (di) => di.dispatchId !== dispatch.id && ([DispatchStatus.CREATED, DispatchStatus.READY, DispatchStatus.DEPARTED] as DispatchStatus[]).includes(di.dispatch.status)
        );
        if (activeDispatchItem) {
          throw new Error(`LR ${booking.lrNumber} is already attached to active dispatch ${activeDispatchItem.dispatch.dispatchNumber}`);
        }

        // Directive 3: Loadable status check
        if (!LOADABLE_BOOKING_STATUSES.includes(booking.status) && booking.status !== BookingStatus.LOADED) {
          throw new Error(`LR ${booking.lrNumber} cannot be loaded (Current status: ${booking.status})`);
        }

        // Check if already in this dispatch
        const existingInThisDispatch = booking.dispatchItems.some((di) => di.dispatchId === dispatch.id);
        if (!existingInThisDispatch) {
          await tx.dispatchItem.create({
            data: {
              dispatchId: dispatch.id,
              bookingId: booking.id,
            },
          });
        }

        // Update Booking status
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            dispatchId: dispatch.id,
            status: BookingStatus.LOADED,
            lastUpdatedBy: data.userId || "SYSTEM",
            lastUpdatedAt: new Date(),
          },
        });

        // Add Tracking History
        await tx.trackingHistory.create({
          data: {
            bookingId: booking.id,
            dispatchId: dispatch.id,
            status: BookingStatus.LOADED,
            title: `Loaded onto Vehicle ${dispatch.vehicleNumber}`,
            publicRemarks: `Consignment loaded onto Vehicle ${dispatch.vehicleNumber} (${dispatch.dispatchNumber})`,
            internalRemarks: `Loaded via counter bulk action.`,
            officeId: dispatch.originOfficeId || undefined,
            userId: data.userId || null,
          },
        });
      }

      return dispatch;
    }, { maxWait: 15000, timeout: 30000 });

    revalidatePath(`/employee/dispatches/${result.id}`);
    revalidatePath("/employee/dispatches");
    return {
      success: true,
      dispatchNumber: result.dispatchNumber,
      message: `Successfully loaded ${cleanLrNumbers.length} LR(s) to ${result.dispatchNumber}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load LRs to dispatch" };
  }
}

/**
 * 3. UNLOAD LR FROM DISPATCH (Atomic Transaction)
 * Removes an LR from manifest before vehicle departure. Respects dispatch locking.
 */
export async function unloadBookingFromDispatchAction(data: {
  dispatchNumber: string;
  lrNumber: string;
  userId?: string;
  userRole?: Role;
}): Promise<DispatchActionResult> {
  if (data.userRole && data.userRole === Role.CUSTOMER) {
    return { success: false, error: "Unauthorized operation." };
  }

  const cleanLr = data.lrNumber.trim().toUpperCase();

  try {
    await db.$transaction(async (tx) => {
      const dispatch = await tx.dispatch.findUnique({
        where: { dispatchNumber: data.dispatchNumber },
      });

      if (!dispatch) throw new Error(`Dispatch ${data.dispatchNumber} not found.`);

      // Directive 4: Dispatch Locking
      if (([DispatchStatus.DEPARTED, DispatchStatus.ARRIVED, DispatchStatus.CLOSED, DispatchStatus.CANCELLED] as DispatchStatus[]).includes(dispatch.status)) {
        throw new Error(`Dispatch ${dispatch.dispatchNumber} is locked (${dispatch.status}). Unloading is not permitted post-departure.`);
      }

      const booking = await tx.booking.findUnique({
        where: { lrNumber: cleanLr },
      });

      if (!booking) throw new Error(`LR ${cleanLr} not found.`);

      // Remove DispatchItem link
      await tx.dispatchItem.deleteMany({
        where: {
          dispatchId: dispatch.id,
          bookingId: booking.id,
        },
      });

      // Reset Booking status back to RECEIVED_AT_ORIGIN
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          dispatchId: null,
          status: BookingStatus.RECEIVED_AT_ORIGIN,
          lastUpdatedBy: data.userId || "SYSTEM",
          lastUpdatedAt: new Date(),
        },
      });

      // Tracking History for unload
      await tx.trackingHistory.create({
        data: {
          bookingId: booking.id,
          dispatchId: dispatch.id,
          status: BookingStatus.RECEIVED_AT_ORIGIN,
          title: `Unloaded from Vehicle ${dispatch.vehicleNumber}`,
          publicRemarks: `Consignment unloaded from vehicle ${dispatch.vehicleNumber} back to origin counter.`,
          officeId: dispatch.originOfficeId || undefined,
          userId: data.userId || null,
        },
      });
    });

    revalidatePath("/employee/dispatches");
    return { success: true, message: `LR ${cleanLr} unloaded successfully.` };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to unload LR" };
  }
}

/**
 * 4. UPDATE DISPATCH STATUS TRANSITION (Atomic Transaction)
 * Handles transitions: CREATED/READY -> DEPARTED -> ARRIVED -> CLOSED
 * Directive 8 Role Restrictions & Directive 9 Atomic Transaction
 */
export async function updateDispatchStatusAction(data: {
  dispatchNumber: string;
  nextStatus: DispatchStatus;
  userId?: string;
  userRole?: Role;
  actualArrival?: Date;
  departureTime?: Date;
}): Promise<DispatchActionResult> {
  const { dispatchNumber, nextStatus, userRole, userId } = data;

  // Role Checks
  if (userRole === Role.CUSTOMER) {
    return { success: false, error: "Unauthorized. Customers cannot update dispatches." };
  }

  if (nextStatus === DispatchStatus.DEPARTED && userRole === Role.PARTNER_OFFICE) {
    // Employee / Origin Office departs vehicle
  }

  try {
    const result = await db.$transaction(async (tx) => {
      const dispatch = await tx.dispatch.findUnique({
        where: { dispatchNumber },
        include: {
          dispatchItems: {
            include: { booking: true },
          },
        },
      });

      if (!dispatch) throw new Error(`Dispatch ${dispatchNumber} not found.`);

      // Update Dispatch record
      const updatedDispatch = await tx.dispatch.update({
        where: { id: dispatch.id },
        data: {
          status: nextStatus,
          departureTime: nextStatus === DispatchStatus.DEPARTED ? data.departureTime || new Date() : dispatch.departureTime,
          actualArrival: nextStatus === DispatchStatus.ARRIVED ? data.actualArrival || new Date() : dispatch.actualArrival,
        },
      });

      // Target Booking Status based on Dispatch Transition
      let targetBookingStatus: BookingStatus | null = null;
      let trackingTitle = "";
      let trackingPublic = "";

      if (nextStatus === DispatchStatus.DEPARTED) {
        targetBookingStatus = BookingStatus.IN_TRANSIT;
        trackingTitle = `Vehicle Departed (${dispatch.vehicleNumber})`;
        trackingPublic = `In Transit: Vehicle ${dispatch.vehicleNumber} has departed origin office towards destination.`;
      } else if (nextStatus === DispatchStatus.ARRIVED) {
        targetBookingStatus = BookingStatus.ARRIVED_AT_DESTINATION_OFFICE;
        trackingTitle = `Vehicle Arrived at Destination`;
        trackingPublic = `Vehicle ${dispatch.vehicleNumber} has arrived at destination office counter.`;
      } else if (nextStatus === DispatchStatus.CLOSED) {
        targetBookingStatus = BookingStatus.READY_FOR_COLLECTION;
        trackingTitle = `Ready for Collection`;
        trackingPublic = `Parcel sorted and ready for collection at destination branch office.`;
      }

      // Cascade update to all loaded bookings
      if (targetBookingStatus && dispatch.dispatchItems.length > 0) {
        for (const item of dispatch.dispatchItems) {
          await tx.booking.update({
            where: { id: item.bookingId },
            data: {
              status: targetBookingStatus,
              currentOfficeId: nextStatus === DispatchStatus.ARRIVED || nextStatus === DispatchStatus.CLOSED ? dispatch.destinationOfficeId : item.booking.currentOfficeId,
              lastUpdatedBy: userId || "SYSTEM",
              lastUpdatedAt: new Date(),
            },
          });

          await tx.trackingHistory.create({
            data: {
              bookingId: item.bookingId,
              dispatchId: dispatch.id,
              status: targetBookingStatus,
              title: trackingTitle,
              publicRemarks: trackingPublic,
              officeId: nextStatus === DispatchStatus.DEPARTED ? dispatch.originOfficeId || undefined : dispatch.destinationOfficeId || undefined,
              userId: userId || null,
            },
          });
        }
      }

      // Activity Log
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: `UPDATE_DISPATCH_STATUS: ${dispatchNumber} -> ${nextStatus}`,
        },
      });

      return updatedDispatch;
    }, { maxWait: 15000, timeout: 30000 });

    revalidatePath("/employee/dispatches");
    return {
      success: true,
      dispatchNumber: result.dispatchNumber,
      message: `Dispatch ${result.dispatchNumber} updated to ${nextStatus}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update dispatch status" };
  }
}

/**
 * 5. GET DISPATCH LISTING WITH FILTERS
 */
export async function getDispatchesAction(filters?: {
  officeId?: string;
  status?: DispatchStatus;
  search?: string;
}) {
  try {
    const whereClause: any = {};

    if (filters?.officeId) {
      whereClause.OR = [{ originOfficeId: filters.officeId }, { destinationOfficeId: filters.officeId }];
    }

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.search) {
      const q = filters.search.trim().toUpperCase();
      whereClause.OR = [
        { dispatchNumber: { contains: q, mode: "insensitive" } },
        { vehicleNumber: { contains: q, mode: "insensitive" } },
        { driverName: { contains: q, mode: "insensitive" } },
      ];
    }

    const dispatches = await db.dispatch.findMany({
      where: whereClause,
      include: {
        originOffice: { select: { id: true, name: true, city: true } },
        destinationOffice: { select: { id: true, name: true, city: true } },
        route: { select: { id: true, etaHours: true, distanceKm: true } },
        dispatchItems: {
          include: {
            booking: {
              include: { items: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, dispatches };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch dispatches", dispatches: [] };
  }
}

/**
 * 6. GET SINGLE DISPATCH DETAILS WITH FULL MANIFEST METRICS
 * Provides Total LR Count, Parcel Quantity, Total Weight, Route & Trip details.
 */
export async function getDispatchDetailsAction(dispatchNumberOrId: string) {
  try {
    const isUuid = dispatchNumberOrId.includes("-");

    const dispatch = await db.dispatch.findFirst({
      where: isUuid ? { id: dispatchNumberOrId } : { dispatchNumber: dispatchNumberOrId.trim().toUpperCase() },
      include: {
        originOffice: true,
        destinationOffice: true,
        route: true,
        dispatchItems: {
          include: {
            booking: {
              include: { items: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!dispatch) {
      return { success: false, error: `Dispatch ${dispatchNumberOrId} not found.` };
    }

    // Directive 6: Manifest Summary Calculations
    const totalLrCount = dispatch.dispatchItems.length;
    let totalParcelCount = 0;
    let totalWeightKg = 0;
    let totalValue = 0;

    dispatch.dispatchItems.forEach((di) => {
      totalValue += di.booking.totalAmount;
      di.booking.items.forEach((item) => {
        totalParcelCount += item.quantity;
        totalWeightKg += (item.weightKg || 1.0) * item.quantity;
      });
    });

    return {
      success: true,
      dispatch,
      summary: {
        totalLrCount,
        totalParcelCount,
        totalWeightKg: Math.round(totalWeightKg * 10) / 10,
        totalValue,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch dispatch details" };
  }
}
