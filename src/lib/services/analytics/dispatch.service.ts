import { prisma } from '@/lib/db';

export interface DispatchFilter {
  officeId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

export async function getDispatchAnalytics(filter?: DispatchFilter) {
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

    const dispatches = await prisma.dispatch.findMany({
      where: whereClause,
      include: {
        originOffice: { select: { name: true } },
        destinationOffice: { select: { name: true } },
        vehicle: { select: { vehicleNumber: true, capacityKg: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalDispatches = dispatches.length;
    const inTransitCount = dispatches.filter((d) => d.status === 'IN_TRANSIT' || d.status === 'DISPATCHED').length;
    const completedCount = dispatches.filter((d) => d.status === 'RECEIVED' || d.status === 'CLOSED').length;

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    dispatches.forEach((d) => {
      const st = d.status || 'SCHEDULED';
      statusBreakdown[st] = (statusBreakdown[st] || 0) + 1;
    });

    return {
      totalDispatches,
      inTransitCount,
      completedCount,
      statusBreakdown,
      dispatches,
    };
  } catch (err: any) {
    console.error('Error fetching dispatch analytics:', err);
    return {
      totalDispatches: 0,
      inTransitCount: 0,
      completedCount: 0,
      statusBreakdown: {},
      dispatches: [],
    };
  }
}
