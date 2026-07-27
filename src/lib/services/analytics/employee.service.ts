import { prisma } from '@/lib/db';

export async function getEmployeeAnalytics(officeId?: string) {
  try {
    const whereClause: any = {};
    if (officeId) {
      whereClause.officeId = officeId;
    }

    const employees = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        employeeCode: true,
        name: true,
        role: true,
        designation: true,
        office: { select: { name: true } },
        isActive: true,
        lastLoginAt: true,
      },
    });

    const leaderboard = employees.map((emp) => ({
      ...emp,
      bookingsCount: Math.floor(Math.random() * 45) + 5, // Simulated aggregated bookings processed
      collectionsAmount: Math.floor(Math.random() * 85000) + 12000, // Simulated collections handled
      rating: (4.0 + Math.random() * 0.9).toFixed(1),
    }));

    leaderboard.sort((a, b) => b.bookingsCount - a.bookingsCount);

    return {
      totalEmployees: employees.length,
      activeEmployees: employees.filter((e) => e.isActive).length,
      leaderboard,
    };
  } catch (err: any) {
    console.error('Error fetching employee analytics:', err);
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      leaderboard: [],
    };
  }
}
