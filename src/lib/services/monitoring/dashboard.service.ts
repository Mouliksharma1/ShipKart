import { db as prisma } from '@/lib/db';
import { getBusinessHealth } from './health.service';
import { getActiveAlerts } from './alert.service';

export async function getExecutiveSummary() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    revenueAgg,
    todayBookingsCount,
    activeDispatchesCount,
    activeVehiclesCount,
    pendingCollectionsCount,
    delayedShipmentsCount,
    activeAlerts
  ] = await Promise.all([
    prisma.booking.aggregate({
      where: { createdAt: { gte: startOfDay }, paymentStatus: 'PAID' as any },
      _sum: { totalAmount: true }
    }).catch(() => ({ _sum: { totalAmount: 0 } })),


    prisma.booking.count({
      where: { createdAt: { gte: startOfDay } }
    }).catch(() => 0),

    prisma.dispatch.count({
      where: { status: { in: ['DEPARTED', 'IN_TRANSIT'] as any[] } }
    }).catch(() => 0),

    prisma.vehicleMaster.count({
      where: { status: 'IN_SERVICE' as any }
    }).catch(() => 0),


    prisma.booking.count({
      where: { paymentType: 'TO_PAY' as any, paymentStatus: 'PENDING' as any, status: { notIn: ['CANCELLED' as any] } }
    }).catch(() => 0),

    prisma.booking.count({
      where: { status: 'DELAYED' as any }
    }).catch(() => 0),


    getActiveAlerts().catch(() => [])
  ]);

  const health = await getBusinessHealth().catch(() => ({ score: 100, rating: 'Excellent' }));

  return {
    todayRevenue: revenueAgg._sum.totalAmount || 0,
    todayBookings: todayBookingsCount,
    activeDispatches: activeDispatchesCount,
    activeVehicles: activeVehiclesCount,
    pendingCollections: pendingCollectionsCount,
    delayedShipments: delayedShipmentsCount,
    openAlertsCount: activeAlerts.length,
    businessHealth: health
  };

}

export async function getTodayOverview() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [completedToday, cancelledToday, loadedToday] = await Promise.all([
    prisma.booking.count({ where: { updatedAt: { gte: startOfDay }, status: 'COMPLETED' } }).catch(() => 0),
    prisma.booking.count({ where: { updatedAt: { gte: startOfDay }, status: 'CANCELLED' } }).catch(() => 0),
    prisma.booking.count({ where: { updatedAt: { gte: startOfDay }, status: 'LOADED' } }).catch(() => 0)
  ]);

  return {
    completedToday,
    cancelledToday,
    loadedToday
  };
}
