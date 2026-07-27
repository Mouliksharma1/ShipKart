import { prisma } from '@/lib/db';

export interface RevenueFilter {
  officeId?: string;
  routeId?: string;
  startDate?: Date;
  endDate?: Date;
  paymentType?: string;
}

export async function getRevenueSummary(filter?: RevenueFilter) {
  try {
    const whereClause: any = {};

    if (filter?.officeId) {
      whereClause.originOfficeId = filter.officeId;
    }

    if (filter?.startDate || filter?.endDate) {
      whereClause.createdAt = {};
      if (filter.startDate) whereClause.createdAt.gte = filter.startDate;
      if (filter.endDate) whereClause.createdAt.lte = filter.endDate;
    }

    if (filter?.paymentType) {
      whereClause.paymentType = filter.paymentType;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        grandTotal: true,
        paymentType: true,
        paymentStatus: true,
        createdAt: true,
        originOffice: { select: { id: true, name: true, city: true } },
      },
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
    const paidRevenue = bookings.filter((b) => b.paymentStatus === 'PAID').reduce((sum, b) => sum + (b.grandTotal || 0), 0);
    const toPayRevenue = bookings.filter((b) => b.paymentStatus === 'PENDING').reduce((sum, b) => sum + (b.grandTotal || 0), 0);

    // Group by Payment Type (CASH, UPI, TO_PAY, etc.)
    const paymentTypeSplit: Record<string, number> = {};
    bookings.forEach((b) => {
      const type = b.paymentType || 'CASH';
      paymentTypeSplit[type] = (paymentTypeSplit[type] || 0) + (b.grandTotal || 0);
    });

    // Group by Office
    const officeRevenueMap: Record<string, { officeName: string; total: number; count: number }> = {};
    bookings.forEach((b) => {
      const officeName = b.originOffice?.name || 'Unassigned';
      if (!officeRevenueMap[officeName]) {
        officeRevenueMap[officeName] = { officeName, total: 0, count: 0 };
      }
      officeRevenueMap[officeName].total += b.grandTotal || 0;
      officeRevenueMap[officeName].count += 1;
    });

    // Daily breakdown for trend charts
    const dailyMap: Record<string, number> = {};
    bookings.forEach((b) => {
      const dateStr = new Date(b.createdAt).toISOString().split('T')[0];
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + (b.grandTotal || 0);
    });

    const dailyTrend = Object.keys(dailyMap)
      .sort()
      .map((date) => ({ date, amount: dailyMap[date] }));

    return {
      totalRevenue,
      paidRevenue,
      toPayRevenue,
      bookingCount: bookings.length,
      paymentTypeSplit,
      officeRevenue: Object.values(officeRevenueMap),
      dailyTrend,
    };
  } catch (err: any) {
    console.error('Error fetching revenue summary:', err);
    return {
      totalRevenue: 0,
      paidRevenue: 0,
      toPayRevenue: 0,
      bookingCount: 0,
      paymentTypeSplit: {},
      officeRevenue: [],
      dailyTrend: [],
    };
  }
}
