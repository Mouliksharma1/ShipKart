import { db } from '@/lib/db';

export async function getEmployeeAnalytics(officeId?: string) {
  try {
    const whereClause: any = {};
    if (officeId) {
      whereClause.officeId = officeId;
    }

    const employees = await db.user.findMany({
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

    // Fetch real booking statistics for each employee
    const leaderboard = await Promise.all(
      employees.map(async (emp) => {
        // Bookings created by or last updated by this staff member
        const userBookings = await db.booking.findMany({
          where: {
            OR: [
              { createdById: emp.id },
              { lastUpdatedBy: emp.id },
            ],
          },
          select: {
            totalAmount: true,
            paymentStatus: true,
          },
        });

        const bookingsCount = userBookings.length;
        const collectionsAmount = userBookings
          .filter((b) => b.paymentStatus === true)
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

        return {
          ...emp,
          bookingsCount,
          collectionsAmount,
        };
      })
    );

    leaderboard.sort((a, b) => b.collectionsAmount - a.collectionsAmount || b.bookingsCount - a.bookingsCount);

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
