import { prisma } from '@/lib/db';
import { BookingStatus, DispatchStatus } from '@prisma/client';

export interface DashboardSummaryFilter {
  officeId?: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getDashboardSummary(filter?: DashboardSummaryFilter) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const whereBooking: any = {};
    const whereDispatch: any = {};

    if (filter?.officeId) {
      whereBooking.originOfficeId = filter.officeId;
      whereDispatch.originOfficeId = filter.officeId;
    }

    if (filter?.startDate || filter?.endDate) {
      whereBooking.createdAt = {};
      if (filter.startDate) whereBooking.createdAt.gte = filter.startDate;
      if (filter.endDate) whereBooking.createdAt.lte = filter.endDate;
    }

    // 1. Total Revenue Today
    const todayBookings = await prisma.booking.findMany({
      where: {
        ...whereBooking,
        createdAt: { gte: startOfToday },
      },
      select: { totalAmount: true, paymentStatus: true, paymentType: true },
    });

    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const todayCount = todayBookings.length;

    // 2. Pending Collections Total
    const pendingBookings = await prisma.booking.aggregate({
      where: {
        ...whereBooking,
        paymentStatus: false,
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    // 3. Active & In-Transit Dispatches
    const activeDispatchesCount = await prisma.dispatch.count({
      where: {
        ...whereDispatch,
        status: { in: [DispatchStatus.DISPATCHED, DispatchStatus.IN_TRANSIT] },
      },
    });

    // 4. In-Transit Shipments
    const inTransitShipmentsCount = await prisma.booking.count({
      where: {
        ...whereBooking,
        status: BookingStatus.IN_TRANSIT,
      },
    });

    // 5. Delayed Shipments
    const delayedShipmentsCount = await prisma.booking.count({
      where: {
        ...whereBooking,
        status: { in: [BookingStatus.BOOKED, BookingStatus.IN_TRANSIT] },
        createdAt: { lte: new Date(Date.now() - 48 * 60 * 60 * 1000) }, // > 48h
      },
    });

    // 6. Completed Today
    const completedTodayCount = await prisma.booking.count({
      where: {
        ...whereBooking,
        status: BookingStatus.DELIVERED,
        updatedAt: { gte: startOfToday },
      },
    });

    return {
      todayRevenue,
      todayCount,
      pendingCollectionsTotal: pendingBookings._sum.totalAmount || 0,
      pendingCollectionsCount: pendingBookings._count.id || 0,
      activeDispatchesCount,
      inTransitShipmentsCount,
      delayedShipmentsCount,
      completedTodayCount,
      generatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Error fetching dashboard summary:', err);
    return {
      todayRevenue: 0,
      todayCount: 0,
      pendingCollectionsTotal: 0,
      pendingCollectionsCount: 0,
      activeDispatchesCount: 0,
      inTransitShipmentsCount: 0,
      delayedShipmentsCount: 0,
      completedTodayCount: 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
