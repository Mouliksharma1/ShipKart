import { prisma } from '@/lib/db';

export async function getCustomerAnalytics() {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        senderName: true,
        senderPhone: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    const customerMap: Record<string, { name: string; phone: string; count: number; totalSpent: number }> = {};

    bookings.forEach((b) => {
      const key = b.senderPhone;
      if (!customerMap[key]) {
        customerMap[key] = {
          name: b.senderName,
          phone: b.senderPhone,
          count: 0,
          totalSpent: 0,
        };
      }
      customerMap[key].count += 1;
      customerMap[key].totalSpent += b.totalAmount || 0;
    });

    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 50);

    const totalCustomers = Object.keys(customerMap).length;
    const returningCustomersCount = Object.values(customerMap).filter((c) => c.count > 1).length;

    return {
      totalCustomers,
      returningCustomersCount,
      newCustomersCount: totalCustomers - returningCustomersCount,
      topCustomers,
    };
  } catch (err: any) {
    console.error('Error fetching customer analytics:', err);
    return {
      totalCustomers: 0,
      returningCustomersCount: 0,
      newCustomersCount: 0,
      topCustomers: [],
    };
  }
}
