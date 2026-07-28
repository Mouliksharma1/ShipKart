import { db as prisma } from '@/lib/db';

export async function getVehicleMonitoring() {
  const vehicles = await prisma.vehicleMaster.findMany().catch(() => []);

  const runningCount = vehicles.filter(v => v.status === 'IN_SERVICE' as any).length;
  const idleCount = vehicles.filter(v => v.status === 'AVAILABLE' as any).length;
  const maintenanceCount = vehicles.filter(v => v.status === 'UNDER_MAINTENANCE' as any || v.status === 'OUT_OF_SERVICE' as any).length;

  const fleetList = vehicles.map(v => {
    return {
      id: v.id,
      registrationNumber: v.registrationNumber,
      vehicleType: v.vehicleType,
      status: v.status,
      capacityTons: Math.round((v.capacityKg || 1000) / 1000),
      capacityPct: v.status === 'IN_SERVICE' as any ? 85 : 0,
      currentRoute: 'Assigned Route Corridor',
      driverName: v.driverName || 'N/A'
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
