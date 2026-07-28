import { db as prisma } from '@/lib/db';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export async function getPartnerDashboardSummary(officeId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const whereOffice: any = officeId ? { originOfficeId: officeId } : {};
  const destWhereOffice: any = officeId ? { destinationOfficeId: officeId } : {};

  const [todayBookings, pendingCollections, todayCollected, incomingDispatches, todayRevenue] = await Promise.all([
    prisma.booking.count({
      where: {
        ...whereOffice,
        createdAt: { gte: startOfDay }
      }
    }).catch(() => 0),

    prisma.booking.count({
      where: {
        ...destWhereOffice,
        status: { in: ['ARRIVED_AT_DESTINATION_OFFICE', 'READY_FOR_COLLECTION'] as any[] }
      }
    }).catch(() => 0),

    prisma.booking.count({
      where: {
        ...destWhereOffice,
        status: { in: ['COLLECTED', 'COMPLETED'] as any[] },
        collectedAt: { gte: startOfDay }
      }
    }).catch(() => 0),

    prisma.dispatch.count({
      where: {
        ...destWhereOffice,
        status: { in: ['DEPARTED', 'IN_TRANSIT'] as any[] }
      }
    }).catch(() => 0),

    prisma.booking.aggregate({
      where: {
        ...whereOffice,
        createdAt: { gte: startOfDay },
        paymentStatus: 'PAID' as any
      },
      _sum: { totalAmount: true }
    }).catch(() => ({ _sum: { totalAmount: 0 } }))
  ]);

  return {
    todayBookings,
    pendingCollections,
    todayCollected,
    incomingDispatches,
    todayRevenue: todayRevenue._sum.totalAmount || 0
  };
}

export async function getIncomingDispatches(officeId?: string) {
  const whereClause: any = {
    status: { in: ['DEPARTED', 'IN_TRANSIT', 'READY'] as any[] }
  };

  if (officeId) {
    whereClause.destinationOfficeId = officeId;
  }

  return prisma.dispatch.findMany({
    where: whereClause,
    include: {
      originOffice: { select: { name: true, city: true } },
      destinationOffice: { select: { name: true, city: true } },
      bookings: {
        select: {
          id: true,
          lrNumber: true,
          receiverName: true,
          receiverPhone: true,
          status: true,
          totalAmount: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}


export async function getPartnerOfficeReport(officeId?: string, startDate?: string, endDate?: string) {
  const whereClause: any = {};
  if (officeId) {
    whereClause.originOfficeId = officeId;
  }

  if (startDate) {
    whereClause.createdAt = { gte: new Date(startDate) };
  }

  const [bookingsCount, revenueAgg, expensesAgg, dispatchesCount] = await Promise.all([
    prisma.booking.count({ where: whereClause }).catch(() => 0),

    prisma.booking.aggregate({
      where: { ...whereClause, paymentStatus: 'PAID' as any },
      _sum: { totalAmount: true }
    }).catch(() => ({ _sum: { totalAmount: 0 } })),

    prisma.expense.aggregate({
      where: officeId ? { officeId } : {},
      _sum: { amount: true }
    }).catch(() => ({ _sum: { amount: 0 } })),

    prisma.dispatch.count({
      where: officeId ? { originOfficeId: officeId } : {}
    }).catch(() => 0)
  ]);

  const grossRevenue = revenueAgg._sum.totalAmount || 0;
  const totalExpenses = expensesAgg._sum.amount || 0;

  return {
    bookingsCount,
    dispatchesCount,
    grossRevenue,
    totalExpenses,
    netRevenue: grossRevenue - totalExpenses
  };
}
