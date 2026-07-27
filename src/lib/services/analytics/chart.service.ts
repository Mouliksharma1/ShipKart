import { prisma } from '@/lib/db';

export async function getChartDatasets(officeId?: string) {
  try {
    const whereBooking: any = {};
    if (officeId) {
      whereBooking.originOfficeId = officeId;
    }

    // 1. Revenue & Booking Trend (Last 7 Days)
    const days: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const bookings = await prisma.booking.findMany({
      where: {
        ...whereBooking,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { totalAmount: true, createdAt: true, paymentType: true, items: { select: { parcelType: true } } },
    });

    const revenueTrend = days.map((day) => {
      const dayBookings = bookings.filter((b) => new Date(b.createdAt).toISOString().split('T')[0] === day);
      const revenue = dayBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      return { day, revenue, bookingsCount: dayBookings.length };
    });

    // 2. Parcel Type Pie Chart Split
    const parcelTypeCounts: Record<string, number> = {
      ENVELOPE: 0,
      BOX: 0,
      MEDIUM_PARCEL: 0,
      LARGE_BUNDLE: 0,
    };
    bookings.forEach((b) => {
      const type = b.items[0]?.parcelType || 'BOX';
      parcelTypeCounts[type] = (parcelTypeCounts[type] || 0) + 1;
    });

    // 3. Payment Type Pie Chart Split
    const paymentTypeCounts: Record<string, number> = {
      CASH: 0,
      UPI: 0,
      TO_PAY: 0,
    };
    bookings.forEach((b) => {
      if (b.paymentType) paymentTypeCounts[b.paymentType] = (paymentTypeCounts[b.paymentType] || 0) + 1;
    });

    return {
      revenueTrend,
      parcelTypeCounts,
      paymentTypeCounts,
    };
  } catch (err: any) {
    console.error('Error fetching chart datasets:', err);
    return {
      revenueTrend: [],
      parcelTypeCounts: {},
      paymentTypeCounts: {},
    };
  }
}
