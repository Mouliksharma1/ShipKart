"use server";

import { db } from "@/lib/db";
import { updateBookingStatus, getBookingTimeline } from "@/lib/services/tracking";
import { getDashboardMetrics, getRecentActivityFeed } from "@/lib/services/tracking-metrics";
import { UpdateTrackingSchema, CreateDispatchSchema } from "@/lib/validations/tracking";
import { BookingStatus, DispatchStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * UPDATE TRACKING STATUS SERVER ACTION
 */
export async function updateTrackingStatusAction(formData: unknown, userId?: string, userRole?: any) {
  const parseResult = UpdateTrackingSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid tracking status data",
    };
  }

  const data = parseResult.data;

  try {
    const result = await updateBookingStatus({
      ...data,
      userId,
      userRole,
    });

    revalidatePath(`/track/${data.lrNumber}`);
    revalidatePath(`/lr/${data.lrNumber}`);
    revalidatePath("/employee/tracking");
    revalidatePath("/partner/dashboard");
    revalidatePath("/admin/tracking");

    return {
      success: true,
      message: `Parcel ${data.lrNumber} status updated to ${data.status.replace(/_/g, " ")}`,
      data: result.booking,
    };
  } catch (err: any) {
    console.error("Update Tracking Status Action Error:", err);
    return {
      success: false,
      error: err?.message || "Failed to update tracking status.",
    };
  }
}

/**
 * GET TIMELINE FOR LR (Public QR Scanner vs Staff view)
 */
export async function getTrackingTimelineAction(lrNumber: string, isStaff = false) {
  try {
    const res = await getBookingTimeline(lrNumber, isStaff);
    if (!res) {
      return { success: false, error: `LR Document ${lrNumber} not found.` };
    }
    return { success: true, data: res };
  } catch (err: any) {
    console.error("Get Tracking Timeline Error:", err);
    return { success: false, error: "Failed to fetch timeline." };
  }
}

/**
 * CREATE DISPATCH MANIFEST SERVER ACTION (One Bus = Many LRs)
 */
export async function createDispatchManifestAction(formData: unknown, userId?: string) {
  const parseResult = CreateDispatchSchema.safeParse(formData);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid dispatch manifest data",
    };
  }

  const data = parseResult.data;

  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Generate monotonic Dispatch Number e.g. DSP000000001
      const count = await tx.dispatch.count();
      const dispatchNumber = `DSP${String(count + 1).padStart(9, "0")}`;

      // 2. Create Dispatch Master
      const dispatch = await tx.dispatch.create({
        data: {
          dispatchNumber,
          vehicleNumber: data.vehicleNumber,
          driverName: data.driverName || null,
          driverPhone: data.driverPhone || null,
          routeId: data.routeId || null,
          originOfficeId: data.originOfficeId,
          destinationOfficeId: data.destinationOfficeId,
          departureTime: data.departureTime ? new Date(data.departureTime) : new Date(),
          estimatedArrival: data.estimatedArrival ? new Date(data.estimatedArrival) : null,
          status: DispatchStatus.DEPARTED,
        },
      });

      // 3. Attach multiple bookings via DispatchItem junction records
      const dispatchItems = await tx.dispatchItem.createMany({
        data: data.bookingIds.map((bookingId) => ({
          dispatchId: dispatch.id,
          bookingId,
        })),
      });

      // 4. Update all attached bookings to IN_TRANSIT and create tracking events
      for (const bookingId of data.bookingIds) {
        const booking = await tx.booking.findUnique({ where: { id: bookingId } });
        if (booking) {
          await tx.booking.update({
            where: { id: bookingId },
            data: {
              status: BookingStatus.IN_TRANSIT,
              dispatchId: dispatch.id,
              lastUpdatedAt: new Date(),
              lastUpdatedBy: userId || null,
              version: { increment: 1 },
            },
          });

          await tx.trackingHistory.create({
            data: {
              bookingId,
              dispatchId: dispatch.id,
              status: BookingStatus.IN_TRANSIT,
              title: "Loaded & In Transit",
              publicRemarks: `Parcel loaded into Bus ${data.vehicleNumber} and in transit to destination.`,
              internalRemarks: `Driver: ${data.driverName || "N/A"} (${data.driverPhone || "N/A"}). Manifest ${dispatchNumber}`,
              officeId: data.originOfficeId,
              userId: userId || null,
              notes: `Dispatched via Manifest ${dispatchNumber}`,
            },
          });
        }
      }

      // 5. Activity Log audit
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: `CREATED_DISPATCH_MANIFEST_${dispatchNumber}_FOR_${data.bookingIds.length}_BOOKINGS`,
        },
      });

      return dispatch;
    }, { maxWait: 10000, timeout: 20000 });

    revalidatePath("/employee/tracking");
    revalidatePath("/partner/dashboard");
    revalidatePath("/admin/tracking");

    return {
      success: true,
      message: `Dispatch Manifest ${result.dispatchNumber} created with ${data.bookingIds.length} parcels attached.`,
      data: result,
    };
  } catch (err: any) {
    console.error("Create Dispatch Action Error:", err);
    return {
      success: false,
      error: `Failed to create dispatch manifest: ${err?.message || String(err)}`,
    };
  }
}

/**
 * GET DASHBOARD METRICS SERVER ACTION
 */
export async function getTrackingMetricsAction(officeId?: string) {
  try {
    const metrics = await getDashboardMetrics(officeId);
    return { success: true, data: metrics };
  } catch (err) {
    console.error("Get Tracking Metrics Error:", err);
    return { success: false, error: "Failed to fetch metrics." };
  }
}

/**
 * GET LIVE ACTIVITY FEED SERVER ACTION
 */
export async function getActivityFeedAction(officeId?: string) {
  try {
    const feed = await getRecentActivityFeed(20, officeId);
    return { success: true, data: feed };
  } catch (err) {
    console.error("Get Activity Feed Error:", err);
    return { success: false, error: "Failed to fetch activity feed." };
  }
}

/**
 * GET PENDING COLLECTIONS FOR PARTNER OFFICE
 */
export async function getPendingCollectionsAction(officeId?: string) {
  try {
    const whereClause: any = {
      status: {
        in: [
          BookingStatus.ARRIVED_AT_DESTINATION,
          BookingStatus.ARRIVED_AT_DESTINATION_OFFICE,
          BookingStatus.UNLOADED,
          BookingStatus.READY_FOR_COLLECTION,
        ],
      },
    };
    if (officeId) {
      whereClause.destinationOfficeId = officeId;
    }

    const bookings = await db.booking.findMany({
      where: whereClause,
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: bookings };
  } catch (err) {
    console.error("Get Pending Collections Error:", err);
    return { success: false, error: "Failed to fetch pending collections.", data: [] };
  }
}
