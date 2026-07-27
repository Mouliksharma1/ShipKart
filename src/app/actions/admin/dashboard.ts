'use server';

import { prisma } from '@/lib/db';
import { getCached } from '@/lib/services/admin/dashboard-cache.service';
import { VehicleStatus, AttendanceStatus } from '@prisma/client';

export async function getDashboardStatsAction() {
  return getCached('admin_dashboard_stats', 120, async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        todayBookingsCount,
        todayRevenueAggregate,
        monthRevenueAggregate,
        dispatchesRunningCount,
        delayedBookingsCount,
        pendingCollectionsCount,
        runningVehiclesCount,
        maintenanceVehiclesCount,
        activeOfficesCount,
        activeEmployeesCount,
        todayAttendancePresentCount,
        recentActivities,
        notificationQueuePendingCount,
        upcomingVehicleExpiriesCount,
      ] = await Promise.all([
        prisma.booking.count({ where: { createdAt: { gte: startOfDay } } }),
        prisma.booking.aggregate({
          where: { createdAt: { gte: startOfDay }, status: { not: 'CANCELLED' } },
          _sum: { totalAmount: true },
        }),
        prisma.booking.aggregate({
          where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
          _sum: { totalAmount: true },
        }),
        prisma.dispatch.count({ where: { status: { in: ['READY', 'DEPARTED'] } } }),
        prisma.booking.count({ where: { status: 'DELAYED' } }),
        prisma.booking.count({ where: { status: 'READY_FOR_COLLECTION' } }),
        prisma.vehicleMaster.count({ where: { isActive: true, status: VehicleStatus.IN_SERVICE } }),
        prisma.vehicleMaster.count({ where: { isActive: true, status: VehicleStatus.UNDER_MAINTENANCE } }),
        prisma.officeMaster.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: true, role: { in: ['EMPLOYEE', 'ADMIN', 'MANAGER', 'COUNTER_EMPLOYEE'] } } }),
        prisma.attendance.count({ where: { date: todayStr, status: AttendanceStatus.PRESENT } }),
        prisma.activityLog.findMany({
          take: 8,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true } } },
        }),
        prisma.notificationQueue.count({ where: { status: 'PENDING' } }),
        prisma.vehicleMaster.count({
          where: {
            isActive: true,
            OR: [
              { insuranceExpiry: { lte: new Date(Date.now() + 30 * 86400000) } },
              { permitExpiry: { lte: new Date(Date.now() + 30 * 86400000) } },
            ],
          },
        }),
      ]);

      return {
        todayBookings: todayBookingsCount,
        todayRevenue: todayRevenueAggregate._sum?.totalAmount || 0,
        monthRevenue: monthRevenueAggregate._sum?.totalAmount || 0,
        dispatchesRunning: dispatchesRunningCount,
        delayedBookings: delayedBookingsCount,
        pendingCollections: pendingCollectionsCount,
        runningVehicles: runningVehiclesCount,
        maintenanceVehicles: maintenanceVehiclesCount,
        activeOffices: activeOfficesCount,
        activeEmployees: activeEmployeesCount,
        employeesPresentToday: todayAttendancePresentCount,
        notificationQueuePending: notificationQueuePendingCount,
        upcomingExpiriesAlerts: upcomingVehicleExpiriesCount,
        recentActivities: recentActivities || [],
      };
    } catch (err) {
      console.warn('Dashboard stats fallback triggered:', err);
      return {
        todayBookings: 0,
        todayRevenue: 0,
        monthRevenue: 0,
        dispatchesRunning: 0,
        delayedBookings: 0,
        pendingCollections: 0,
        runningVehicles: 0,
        maintenanceVehicles: 0,
        activeOffices: 0,
        activeEmployees: 0,
        employeesPresentToday: 0,
        notificationQueuePending: 0,
        upcomingExpiriesAlerts: 0,
        recentActivities: [],
      };
    }
  });
}
