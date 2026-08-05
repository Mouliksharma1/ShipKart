"use server";

import { db } from "@/lib/db";
import { calculatePrice } from "@/lib/services/pricing";
import { CreateBookingSchema } from "@/lib/validations/booking";
import { PickupMethod, BookingStatus, NotificationEvent, NotificationRecipientType, PaymentType, PaymentMode, Role } from "@prisma/client";
import { enqueueNotification } from "@/lib/services/notification";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

export type EmployeeBookingActionResult = {
  success: boolean;
  message?: string;
  lrNumber?: string;
  bookingId?: string;
  error?: string;
};

/**
 * CREATE EMPLOYEE COUNTER BOOKING SERVER ACTION
 * Executes atomic Prisma $transaction:
 * 1. Price calculation using central calculatePrice() service
 * 2. Monotonic global LR generation (0001, 0002, ..., 9999, 10000, ...)
 * 3. User Upsert / Saved Receivers update for Customer lookup & quick fill
 * 4. Booking, ConsignmentItems, TrackingHistory, NotificationQueue, ActivityLog creation
 */
export async function createEmployeeBookingAction(formData: unknown, employeeUserId?: string): Promise<EmployeeBookingActionResult> {
  const parseResult = CreateBookingSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid booking data" };
  }

  const data = parseResult.data;

  // Resolve staff user ID from cookie if not explicitly passed
  let activeStaffId = employeeUserId;
  if (!activeStaffId) {
    try {
      const cookieStore = await cookies();
      activeStaffId = cookieStore.get("shipkart_staff_id")?.value;
    } catch (_) {}
  }

  try {
    let totalSubtotal = 0;
    let totalPickupCharge = 0;
    const evaluatedItems: Array<{
      parcelType: any;
      quantity: number;
      weightKg?: number;
      photoUrl?: string | null;
      remarks?: string | null;
      unitPrice: number;
      selfPrice: number;
      taxiPrice: number | null;
      subtotal: number;
      itemPickupCharge: number;
    }> = [];

    const totalQuantity = data.items.reduce((acc, item) => acc + item.quantity, 0);

    for (const item of data.items) {
      const priceRes = await calculatePrice({
        originOfficeId: data.originOfficeId,
        destinationOfficeId: data.destinationOfficeId,
        parcelType: item.parcelType,
        pickupMethod: data.pickupMethod,
        quantity: item.quantity,
        pickupDistanceKm: data.pickupDistanceKm,
      });

      if (!priceRes.success) {
        return {
          success: false,
          error: `Price calculation failed for ${item.parcelType}: ${priceRes.error}`,
        };
      }

      if (data.pickupMethod === PickupMethod.TAXI_PICKUP) {
        if (item.parcelType === "ENVELOPE") {
          return { success: false, error: "Taxi Pickup is not available for Envelope consignments." };
        }
        if (totalQuantity < 5) {
          return { success: false, error: `Taxi pickup unavailable: Total parcel quantity (${totalQuantity}) is below minimum 5 items.` };
        }
      }

      const unitPrice = priceRes.unitPrice || 0;
      const selfPrice = priceRes.selfPrice || 0;
      const taxiPrice = priceRes.taxiPrice ?? null;
      const subtotal = priceRes.subtotal || 0;
      const itemPickupCharge = priceRes.pickupCharge || 0;

      totalSubtotal += subtotal;
      totalPickupCharge += itemPickupCharge;

      evaluatedItems.push({
        parcelType: item.parcelType,
        quantity: item.quantity,
        weightKg: item.weightKg || 1.0,
        photoUrl: item.photoUrl || null,
        remarks: item.remarks || null,
        unitPrice,
        selfPrice,
        taxiPrice,
        subtotal,
        itemPickupCharge,
      });
    }

    let grandTotal = totalSubtotal;
    const isCustomPrice = data.customOverridePrice !== undefined && data.customOverridePrice !== null && data.customOverridePrice >= 0;

    if (isCustomPrice) {
      grandTotal = data.customOverridePrice!;
      const ratio = totalSubtotal > 0 ? grandTotal / totalSubtotal : 1;

      for (const item of evaluatedItems) {
        item.unitPrice = Math.round(item.unitPrice * ratio * 100) / 100;
        item.selfPrice = Math.round(item.selfPrice * ratio * 100) / 100;
        if (item.taxiPrice !== null) {
          item.taxiPrice = Math.round(item.taxiPrice * ratio * 100) / 100;
        }
        item.subtotal = Math.round(item.subtotal * ratio * 100) / 100;
        item.itemPickupCharge = Math.round(item.itemPickupCharge * ratio * 100) / 100;
      }
    }

    const createdBooking = await db.$transaction(async (tx) => {
      // 1. Monotonic LR Number (0001, 0002, ..., 9999, 10000, ...)
      let seq = await tx.lRSequence.findFirst({ where: { id: 1 } });
      if (!seq) {
        seq = await tx.lRSequence.create({ data: { id: 1, lastNumber: 0 } });
      }

      const nextNumber = seq.lastNumber + 1;
      await tx.lRSequence.update({
        where: { id: 1 },
        data: { lastNumber: nextNumber },
      });

      // Pad to 4 digits up to 9999; natural number beyond (10000, 10001, ...)
      const lrNumber =
        nextNumber <= 9999
          ? nextNumber.toString().padStart(4, "0")
          : nextNumber.toString();

      // 2. Lookup or create Sender User account if not exists
      let senderUser = await tx.user.findUnique({
        where: { phone: data.senderPhone },
      });

      if (!senderUser) {
        senderUser = await tx.user.create({
          data: {
            name: data.senderName,
            phone: data.senderPhone,
            email: data.senderEmail || undefined,
            role: Role.CUSTOMER,
          },
        });
      }

      // 3. Save receiver for fast future auto-fill
      if (senderUser) {
        const existingReceiver = await tx.savedReceiver.findFirst({
          where: {
            customerId: senderUser.id,
            phone: data.receiverPhone,
          },
        });

        if (!existingReceiver) {
          await tx.savedReceiver.create({
            data: {
              customerId: senderUser.id,
              name: data.receiverName,
              phone: data.receiverPhone,
            },
          });
        }
      }

      // 4. Create Master Booking
      const booking = await tx.booking.create({
        data: {
          lrNumber,
          senderName: data.senderName,
          senderPhone: data.senderPhone,
          senderEmail: data.senderEmail || null,
          receiverName: data.receiverName,
          receiverPhone: data.receiverPhone,
          originOfficeId: data.originOfficeId,
          destinationOfficeId: data.destinationOfficeId,
          pickupMethod: data.pickupMethod,
          pickupAddress: data.pickupAddress || null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          locationAccuracy: data.locationAccuracy || null,
          paymentType: data.paymentType,
          paymentMode: data.paymentMode,
          paymentStatus: data.paymentType === PaymentType.PAID,
          subtotalAmount: totalSubtotal - totalPickupCharge,
          totalPickupCharge: totalPickupCharge,
          totalAmount: grandTotal,
          specialNotes: data.specialNotes || null,
          status: BookingStatus.BOOKED,
          createdById: activeStaffId || null,
        },
      });

      // 5. Create Consignment Items
      await tx.consignmentItem.createMany({
        data: evaluatedItems.map((item) => ({
          bookingId: booking.id,
          parcelType: item.parcelType,
          quantity: item.quantity,
          weightKg: item.weightKg,
          photoUrl: item.photoUrl,
          remarks: item.remarks,
          unitPrice: item.unitPrice,
          selfPrice: item.selfPrice,
          taxiPrice: item.taxiPrice,
          subtotal: item.subtotal,
          itemPickupCharge: item.itemPickupCharge,
        })),
      });

      // 6. Tracking History
      await tx.trackingHistory.create({
        data: {
          bookingId: booking.id,
          status: BookingStatus.BOOKED,
          officeId: data.originOfficeId,
          userId: activeStaffId || null,
          notes: `Counter Booking created by employee. LR: ${lrNumber}`,
        },
      });

      // 7. Notification Queue via Central Notification Engine
      try {
        const originOffice = await tx.officeMaster.findUnique({ where: { id: data.originOfficeId } });
        const destOffice = await tx.officeMaster.findUnique({ where: { id: data.destinationOfficeId } });

        const commonVars = {
          senderName: data.senderName,
          receiverName: data.receiverName,
          lrNumber,
          origin: originOffice?.name || 'Origin Office',
          destination: destOffice?.name || 'Destination Office',
          trackingUrl: `https://shipkart.app/track/${booking.id || lrNumber}`,
        };

        // Sender Notification
        await enqueueNotification({
          event: NotificationEvent.BOOKING_CREATED,
          bookingId: booking.id,
          lrNumber,
          recipientType: NotificationRecipientType.SENDER,
          recipientName: data.senderName,
          recipientPhone: data.senderPhone,
          variables: commonVars,
          deduplicationKey: `employee_booking_created_sender_${booking.id}`,
        });

        // Receiver Notification
        await enqueueNotification({
          event: NotificationEvent.BOOKING_CREATED,
          bookingId: booking.id,
          lrNumber,
          recipientType: NotificationRecipientType.RECEIVER,
          recipientName: data.receiverName,
          recipientPhone: data.receiverPhone,
          variables: commonVars,
          deduplicationKey: `employee_booking_created_receiver_${booking.id}`,
        });
      } catch (notifErr) {
        console.error('Failed to enqueue employee booking notification:', notifErr);
      }

      // 8. Activity Log
      await tx.activityLog.create({
        data: {
          userId: employeeUserId || null,
          action: `CREATED_COUNTER_BOOKING_${lrNumber}`,
        },
      });

      return booking;
    }, { maxWait: 10000, timeout: 25000 });

    revalidatePath("/employee");
    revalidatePath("/employee/bookings");
    return {
      success: true,
      message: "Counter Booking created successfully!",
      lrNumber: createdBooking.lrNumber,
      bookingId: createdBooking.id,
    };
  } catch (err: any) {
    console.error("Create Employee Booking Error:", err);
    return {
      success: false,
      error: `Failed to create counter booking: ${err?.message || String(err)}`,
    };
  }
}

/**
 * CUSTOMER LOOKUP ACTION
 * Fast lookup by phone for auto-filling customer details & saved receivers
 */
export async function getCustomerHistoryAction(phone: string) {
  try {
    if (!phone || phone.length < 10) {
      return { success: false, error: "Valid 10-digit mobile number required" };
    }

    const user = await db.user.findUnique({
      where: { phone },
      include: {
        savedReceivers: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    const previousBookings = await db.booking.findMany({
      where: { senderPhone: phone },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
      },
    });

    return {
      success: true,
      data: {
        user,
        savedReceivers: user?.savedReceivers || [],
        previousBookings,
      },
    };
  } catch (err) {
    console.error("Customer History Error:", err);
    return { success: false, error: "Failed to fetch customer history." };
  }
}

/**
 * REPEAT BOOKING PRE-FILL ACTION
 * Loads previous booking data structure for cloning
 */
export async function repeatBookingAction(lrNumber: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { lrNumber },
      include: {
        items: true,
        originOffice: true,
        destinationOffice: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Previous booking not found" };
    }

    return {
      success: true,
      data: {
        senderName: booking.senderName,
        senderPhone: booking.senderPhone,
        senderEmail: booking.senderEmail || "",
        receiverName: booking.receiverName,
        receiverPhone: booking.receiverPhone,
        originOfficeId: booking.originOfficeId,
        destinationOfficeId: booking.destinationOfficeId,
        pickupMethod: booking.pickupMethod,
        paymentType: booking.paymentType,
        paymentMode: booking.paymentMode,
        specialNotes: booking.specialNotes || "",
        items: booking.items.map((i) => ({
          parcelType: i.parcelType,
          quantity: i.quantity,
          weightKg: i.weightKg || 1.0,
          remarks: i.remarks || "",
        })),
      },
    };
  } catch (err) {
    console.error("Repeat Booking Error:", err);
    return { success: false, error: "Failed to clone booking data." };
  }
}

/**
 * SEARCH BOOKINGS SERVER ACTION
 */
export async function searchBookingsAction(query: {
  search?: string;
  status?: BookingStatus;
  paymentType?: PaymentType;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const whereClause: any = {};

    if (query.search) {
      const s = query.search.trim();
      whereClause.OR = [
        { lrNumber: { contains: s, mode: "insensitive" } },
        { senderName: { contains: s, mode: "insensitive" } },
        { senderPhone: { contains: s } },
        { receiverName: { contains: s, mode: "insensitive" } },
        { receiverPhone: { contains: s } },
      ];
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.paymentType) {
      whereClause.paymentType = query.paymentType;
    }

    if (query.startDate || query.endDate) {
      whereClause.createdAt = {};
      if (query.startDate) {
        whereClause.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.createdAt.lte = new Date(query.endDate);
      }
    }

    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
        createdBy: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { success: true, data: bookings };
  } catch (err) {
    console.error("Search Bookings Error:", err);
    return { success: false, error: "Failed to search bookings.", data: [] };
  }
}

/**
 * GET SINGLE BOOKING DETAILS
 */
export async function getBookingAction(lrNumber: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { lrNumber },
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
        createdBy: true,
        trackingHistory: {
          include: { office: true, user: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking) {
      return { success: false, error: `Booking ${lrNumber} not found.` };
    }

    return { success: true, data: booking };
  } catch (err) {
    console.error("Get Booking Error:", err);
    return { success: false, error: "Failed to load booking details." };
  }
}

/**
 * GET EMPLOYEE DASHBOARD METRICS
 */
export async function getEmployeeDashboardMetricsAction() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [todayBookingsCount, todayBookings, pendingPaymentsCount, pendingCollectionsCount] = await Promise.all([
      db.booking.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      db.booking.findMany({
        where: { createdAt: { gte: startOfToday } },
        select: { totalAmount: true, lrNumber: true, paymentType: true, paymentStatus: true },
      }),
      db.booking.count({
        where: { paymentType: PaymentType.TO_PAY, paymentStatus: false },
      }),
      db.booking.count({
        where: { status: BookingStatus.READY_FOR_COLLECTION },
      }),
    ]);

    const todayRevenue = todayBookings.reduce((sum, b) => (b.paymentStatus ? sum + b.totalAmount : sum), 0);

    const recentBookings = await db.booking.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
      },
    });

    return {
      success: true,
      data: {
        todayBookingsCount,
        todayRevenue,
        pendingPaymentsCount,
        pendingCollectionsCount,
        todayLrCount: todayBookingsCount,
        recentBookings,
      },
    };
  } catch (err) {
    console.error("Get Employee Metrics Error:", err);
    return {
      success: false,
      error: "Failed to fetch dashboard metrics.",
      data: {
        todayBookingsCount: 0,
        todayRevenue: 0,
        pendingPaymentsCount: 0,
        pendingCollectionsCount: 0,
        todayLrCount: 0,
        recentBookings: [],
      },
    };
  }
}

/**
 * CANCEL LR / BOOKING ACTION (Available to Employee & Admin)
 * Updates status to CANCELLED and records who cancelled it with timestamp.
 * Format: "LR CANCELLED BY :- RAJESH SHARMA AT 06:00 PM (31 JUL 2026)"
 */
export async function cancelBookingAction(lrNumber: string, reason?: string) {
  try {
    if (!lrNumber) {
      return { success: false, error: "LR Number is required for cancellation." };
    }

    const cookieStore = await cookies();
    const staffId = cookieStore.get("shipkart_staff_id")?.value;
    const staffName = cookieStore.get("shipkart_staff_name")?.value || "ADMIN";

    // Find staff user name and role if ID present
    let cancellerName = "ADMIN";
    if (staffId) {
      const user = await db.user.findUnique({ where: { id: staffId } });
      if (user) {
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
          cancellerName = "ADMIN";
        } else {
          cancellerName = user.name || user.username || staffName;
        }
      }
    }

    const booking = await db.booking.findUnique({
      where: { lrNumber },
      include: { originOffice: true }
    });

    if (!booking) {
      return { success: false, error: `Consignment LR ${lrNumber} not found.` };
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return { success: false, error: `LR ${lrNumber} is already cancelled.` };
    }

    const formattedTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const formattedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const cancelAuditText = `LR CANCELLED BY :- ${cancellerName.toUpperCase()} AT ${formattedTime} (${formattedDate})`;

    await db.$transaction([
      db.booking.update({
        where: { lrNumber },
        data: {
          status: BookingStatus.CANCELLED,
          lastUpdatedAt: new Date(),
          lastUpdatedBy: cancelAuditText,
        }
      }),
      db.trackingHistory.create({
        data: {
          bookingId: booking.id,
          status: BookingStatus.CANCELLED,
          officeId: booking.originOfficeId,
          userId: staffId || null,
          notes: cancelAuditText + (reason ? ` | Reason: ${reason}` : ""),
        }
      })
    ]);

    revalidatePath(`/lr/${lrNumber}`);
    revalidatePath(`/employee/bookings/${lrNumber}`);
    revalidatePath("/employee/bookings");
    revalidatePath("/admin/reports/bookings");

    return {
      success: true,
      message: `LR ${lrNumber} successfully cancelled by ${cancellerName} at ${formattedTime}.`,
      cancelledByInfo: cancelAuditText
    };
  } catch (err: any) {
    console.error("Cancel Booking Error:", err);
    return {
      success: false,
      error: `Failed to cancel LR: ${err?.message || String(err)}`
    };
  }
}
