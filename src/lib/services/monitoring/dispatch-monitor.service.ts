import { db as prisma } from '@/lib/db';

export async function getDispatchMonitoring() {
  const dispatches = await prisma.dispatch.findMany({
    where: { status: { in: ['READY', 'DEPARTED', 'IN_TRANSIT'] as any[] } },
    include: {
      originOffice: { select: { name: true, city: true } },
      destinationOffice: { select: { name: true, city: true } },
      route: {
        select: {
          etaHours: true,
          originOffice: { select: { city: true } },
          destinationOffice: { select: { city: true } }
        }
      }
    },
    orderBy: { departureTime: 'desc' },
    take: 20
  }).catch(() => []);

  const totalRunning = dispatches.length;
  const delayedCount = dispatches.filter(d => d.estimatedArrival && new Date() > new Date(d.estimatedArrival)).length;

  const dispatchList = dispatches.map(d => {
    const isDelayed = d.estimatedArrival ? new Date() > new Date(d.estimatedArrival) : false;
    const loadPct = 85;

    return {
      id: d.id,
      manifestNumber: d.dispatchNumber,
      status: d.status,
      origin: d.originOffice?.city || d.route?.originOffice?.city || 'Origin',
      destination: d.destinationOffice?.city || d.route?.destinationOffice?.city || 'Destination',
      vehicleNumber: d.vehicleNumber || 'N/A',
      driverName: d.driverName || 'N/A',
      departureTime: d.departureTime,
      expectedArrivalTime: d.estimatedArrival,
      isDelayed,
      loadPct
    };
  });

  return {
    summary: {
      totalRunning,
      delayedCount,
      etaCompliancePct: totalRunning > 0 ? Math.round(((totalRunning - delayedCount) / totalRunning) * 100) : 100,
      avgLoadPct: dispatchList.length > 0 ? Math.round(dispatchList.reduce((acc, curr) => acc + curr.loadPct, 0) / dispatchList.length) : 0
    },
    dispatches: dispatchList
  };
}
