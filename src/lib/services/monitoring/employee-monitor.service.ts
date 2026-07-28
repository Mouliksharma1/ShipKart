import { db as prisma } from '@/lib/db';

export async function getEmployeeMonitoring() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const employees = await prisma.user.findMany({
    where: { role: { in: ['EMPLOYEE', 'COUNTER_EMPLOYEE', 'MANAGER', 'ACCOUNTANT'] }, isActive: true },
    select: { id: true, name: true, email: true, role: true, office: { select: { name: true } } },
    take: 20
  }).catch(() => []);

  const leaderboard = await Promise.all(
    employees.map(async (emp) => {
      const [bookingsCount, collectionsAgg] = await Promise.all([
        prisma.booking.count({ where: { createdById: emp.id, createdAt: { gte: startOfDay } } }).catch(() => 0),
        prisma.booking.aggregate({
          where: { createdById: emp.id, createdAt: { gte: startOfDay }, paymentStatus: 'PAID' as any },
          _sum: { totalAmount: true }
        }).catch(() => ({ _sum: { totalAmount: 0 } }))
      ]);


      const productivityScore = Math.min(100, (bookingsCount * 10) + 20);

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        officeName: emp.office?.name || 'Head Office',
        bookingsProcessedToday: bookingsCount,
        collectionsTotal: collectionsAgg._sum.totalAmount || 0,
        productivityScore,
        avgProcessingMinutes: Math.max(3, Math.round(15 - bookingsCount * 0.5))
      };

    })
  );

  leaderboard.sort((a, b) => b.productivityScore - a.productivityScore);

  return leaderboard.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
