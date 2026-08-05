import { prisma } from '@/lib/db';

export interface BookingFilter {
  officeId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  parcelType?: string;
}

export async function getBookingAnalytics(filter?: BookingFilter) {
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

    if (filter?.status) {
      whereClause.status = filter.status;
    }

    if (filter?.parcelType) {
      whereClause.parcelType = filter.parcelType;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        lrNumber: true,
        status: true,
        totalAmount: true,
        pickupMethod: true,
        pickupAddress: true,
        latitude: true,
        longitude: true,
        locationAccuracy: true,
        lastUpdatedBy: true,
        updatedAt: true,
        createdAt: true,
        items: { select: { parcelType: true } },
        originOffice: { select: { name: true } },
      },
    });

    const totalBookings = bookings.length;
    const totalValue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const averageValue = totalBookings > 0 ? Math.round(totalValue / totalBookings) : 0;

    // Parcel Type Breakdown
    const parcelTypeBreakdown: Record<string, number> = {};
    bookings.forEach((b) => {
      const type = b.items[0]?.parcelType || 'BOX';
      parcelTypeBreakdown[type] = (parcelTypeBreakdown[type] || 0) + 1;
    });

    // Peak Booking Hours (0-23)
    const hourMap: Record<number, number> = {};
    bookings.forEach((b) => {
      const hour = new Date(b.createdAt).getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });

    const peakHours = Object.keys(hourMap).map((h) => ({
      hour: `${h}:00`,
      count: hourMap[parseInt(h)],
    }));

    // Status Breakdown
    const statusBreakdown: Record<string, number> = {};
    bookings.forEach((b) => {
      const st = b.status || 'BOOKED';
      statusBreakdown[st] = (statusBreakdown[st] || 0) + 1;
    });

    return {
      totalBookings,
      totalValue,
      averageValue,
      parcelTypeBreakdown,
      peakHours,
      statusBreakdown,
      bookings: bookings.slice(0, 100), // top 100 for tables
    };
  } catch (err: any) {
    console.error('Error fetching booking analytics:', err);
    return {
      totalBookings: 0,
      totalValue: 0,
      averageValue: 0,
      parcelTypeBreakdown: {},
      peakHours: [],
      statusBreakdown: {},
      bookings: [],
    };
  }
}
