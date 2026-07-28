import { db as prisma } from '@/lib/db';

export async function getVehicleMonitoring() {
  const vehicles = await prisma.vehicleMaster.findMany({
    include: {
      dispatches: {
        where: { status: { in: ['READY', 'DEPARTED', 'IN_TRANSIT'] as any[] } },
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: { route: true }
      }
    }
  }).catch(() => []);


  const runningCount = vehicles.filter(v => v.status === 'IN_SERVICE').length;
  const idleCount = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'UNDER_MAINTENANCE' || v.status === 'OUT_OF_SERVICE').length;

  const fleetList = vehicles.map(v => {
    const activeDispatch = v.dispatches[0];
    const capacityPct = activeDispatch ? Math.min(100, Math.round((activeDispatch.actualWeightKg / (v.capacityTons * 1000)) * 100)) : 0;

    return {
      id: v.id,
      registrationNumber: v.registrationNumber,
      vehicleType: v.vehicleType,
      status: v.status,
      capacityTons: v.capacityTons,
      capacityPct,
      currentRoute: activeDispatch?.route ? `${activeDispatch.route.sourceCity} → ${activeDispatch.route.destinationCity}` : 'Unassigned',
      driverName: activeDispatch?.driverName || 'N/A'
    };
  });

  return {
    summary: {
      total: vehicles.length,
      running: runningCount,
      idle: idleCount,
      maintenance: maintenanceCount,
      avgUtilization: Math.round((runningCount / Math.max(1, vehicles.length)) * 100)
    },
    vehicles: fleetList
  };
}
