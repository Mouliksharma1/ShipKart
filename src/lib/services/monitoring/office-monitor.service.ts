import { db as prisma } from '@/lib/db';

export async function getOfficeMonitoring() {
  const offices = await prisma.officeMaster.findMany({
    where: { isActive: true },
    select: { id: true, name: true, code: true, city: true, officeType: true }
  }).catch(() => []);


  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const results = await Promise.all(
    offices.map(async (off) => {
      const [todayBookings, todayRevenueAgg, pendingCollections, activeDispatches, delayedShipments, activeEmployees] = await Promise.all([
        prisma.booking.count({ where: { originOfficeId: off.id, createdAt: { gte: startOfDay } } }).catch(() => 0),
        prisma.booking.aggregate({
          where: { originOfficeId: off.id, createdAt: { gte: startOfDay }, paymentStatus: 'PAID' as any },
          _sum: { totalAmount: true }
        }).catch(() => ({ _sum: { totalAmount: 0 } })),

        prisma.booking.count({ where: { originOfficeId: off.id, paymentType: 'TO_PAY', paymentStatus: 'PENDING' } }).catch(() => 0),
        prisma.dispatch.count({ where: { originOfficeId: off.id, status: { in: ['DEPARTED', 'IN_TRANSIT'] } } }).catch(() => 0),
        prisma.booking.count({ where: { originOfficeId: off.id, status: 'DELAYED' } }).catch(() => 0),
        prisma.user.count({ where: { officeId: off.id, isActive: true } }).catch(() => 0)
      ]);

      const healthScore = Math.max(0, 100 - (delayedShipments * 10) - (pendingCollections > 15 ? 15 : 0));

      return {
        id: off.id,
        name: off.name,
        code: off.code,
        city: off.city,
        type: off.officeType,

        todayBookings,
        todayRevenue: todayRevenueAgg._sum.totalAmount || 0,

        pendingCollections,
        activeDispatches,
        delayedShipments,
        activeEmployees,
        healthScore
      };
    })
  );

  return results;
}
