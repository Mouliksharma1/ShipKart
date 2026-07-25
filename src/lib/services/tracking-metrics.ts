import { db } from "@/lib/db";
import { BookingStatus, DispatchStatus } from "@prisma/client";

/**
 * CENTRALIZED TRACKING METRICS SERVICE
 * Provides unified queries for Employee, Partner Office, and Admin dashboards.
 */

export async function getDashboardMetrics(officeId?: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const officeWhere = officeId ? { destinationOfficeId: officeId } : {};
  const originWhere = officeId ? { originOfficeId: officeId } : {};

  const [
    todayBookingsCount,
    inTransitCount,
    pendingCollectionCount,
    completedTodayCount,
    delayedCount,
    holdCount,
    todayDispatchesCount,
  ] = await Promise.all([
    db.booking.count({
      where: {
        createdAt: { gte: startOfToday },
        ...originWhere,
      },
    }),
    db.booking.count({
      where: {
        status: { in: [BookingStatus.IN_TRANSIT, BookingStatus.LOADED] },
        ...officeWhere,
      },
    }),
    db.booking.count({
      where: {
        status: { in: [BookingStatus.READY_FOR_COLLECTION, BookingStatus.ARRIVED_AT_DESTINATION] },
        ...officeWhere,
      },
    }),
    db.booking.count({
      where: {
        status: { in: [BookingStatus.COLLECTED, BookingStatus.COMPLETED] },
        collectedAt: { gte: startOfToday },
        ...officeWhere,
      },
    }),
    db.booking.count({
      where: {
        status: BookingStatus.DELAYED,
        ...officeWhere,
      },
    }),
    db.booking.count({
      where: {
        status: BookingStatus.HOLD,
        ...officeWhere,
      },
    }),
    db.dispatch.count({
      where: {
        createdAt: { gte: startOfToday },
      },
    }),
  ]);

  return {
    todayBookingsCount,
    inTransitCount,
    pendingCollectionCount,
    completedTodayCount,
    delayedCount,
    holdCount,
    todayDispatchesCount,
  };
}

/**
 * FETCH RECENT AUDIT ACTIVITY FEED (Latest 20 tracking events)
 */
export async function getRecentActivityFeed(limit = 20, officeId?: string) {
  const whereClause = officeId ? { officeId } : {};

  const events = await db.trackingHistory.findMany({
    where: whereClause,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      booking: {
        select: {
          lrNumber: true,
          senderName: true,
          receiverName: true,
          originOffice: { select: { name: true, city: true } },
          destinationOffice: { select: { name: true, city: true } },
        },
      },
      office: {
        select: { name: true, city: true },
      },
      user: {
        select: { name: true, role: true },
      },
    },
  });

  return events.map((e) => ({
    id: e.id,
    lrNumber: e.booking?.lrNumber || "N/A",
    status: e.status,
    title: e.title || e.status.replace(/_/g, " "),
    publicRemarks: e.publicRemarks || e.notes,
    internalRemarks: e.internalRemarks,
    officeName: e.office?.name || e.booking?.originOffice?.name || "System",
    officeCity: e.office?.city || "",
    staffName: e.user?.name || "System Automated",
    createdAt: e.createdAt,
  }));
}
