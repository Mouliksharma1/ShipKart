import { prisma } from '@/lib/db';
import { normalizeLRNumber } from '@/lib/utils/normalize-lr';

export interface GlobalSearchResult {
  category: 'BOOKING' | 'DISPATCH' | 'EMPLOYEE' | 'OFFICE' | 'VEHICLE' | 'ROUTE';
  id: string;
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
}

export async function globalAdminSearch(query: string): Promise<GlobalSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();
  const results: GlobalSearchResult[] = [];

  const [bookings, dispatches, employees, offices, vehicles, routes] = await Promise.all([
    // Search Bookings (with LR normalization for leading-zero tolerance)
    prisma.booking.findMany({
      where: {
        OR: [
          { lrNumber: { contains: q, mode: 'insensitive' } },
          { lrNumber: { contains: normalizeLRNumber(q).padStart(4, '0'), mode: 'insensitive' } },
          { senderPhone: { contains: q, mode: 'insensitive' } },
          { receiverPhone: { contains: q, mode: 'insensitive' } },
          { senderName: { contains: q, mode: 'insensitive' } },
          { receiverName: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
      include: { originOffice: true, destinationOffice: true },
    }),

    // Search Dispatches
    prisma.dispatch.findMany({
      where: {
        OR: [
          { dispatchNumber: { contains: q, mode: 'insensitive' } },
          { vehicleNumber: { contains: q, mode: 'insensitive' } },
          { driverName: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),

    // Search Employees
    prisma.user.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
          { employeeCode: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),

    // Search Offices
    prisma.officeMaster.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
          { officeCode: { contains: q, mode: 'insensitive' } },
          { code: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),

    // Search Vehicles
    prisma.vehicleMaster.findMany({
      where: {
        isActive: true,
        OR: [
          { vehicleNumber: { contains: q, mode: 'insensitive' } },
          { registrationNumber: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),

    // Search Routes
    prisma.routeMaster.findMany({
      where: {
        isActive: true,
        OR: [
          { routeCode: { contains: q, mode: 'insensitive' } },
          { originOffice: { name: { contains: q, mode: 'insensitive' } } },
          { destinationOffice: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      take: 5,
      include: { originOffice: true, destinationOffice: true },
    }),
  ]);

  for (const b of bookings) {
    results.push({
      category: 'BOOKING',
      id: b.id,
      title: `LR: ${b.lrNumber}`,
      subtitle: `${b.senderName} ➔ ${b.receiverName} (${b.originOffice.city} to ${b.destinationOffice.city})`,
      url: `/admin/bookings/${b.id}`,
      badge: b.status,
    });
  }

  for (const d of dispatches) {
    results.push({
      category: 'DISPATCH',
      id: d.id,
      title: `Dispatch: ${d.dispatchNumber}`,
      subtitle: `Vehicle: ${d.vehicleNumber} | Driver: ${d.driverName || 'N/A'}`,
      url: `/admin/dispatches/${d.id}`,
      badge: d.status,
    });
  }

  for (const e of employees) {
    results.push({
      category: 'EMPLOYEE',
      id: e.id,
      title: `${e.name} (${e.employeeCode || e.role})`,
      subtitle: `Phone: ${e.phone} | Designation: ${e.designation || 'Staff'}`,
      url: `/admin/employees/${e.id}`,
      badge: e.role,
    });
  }

  for (const o of offices) {
    results.push({
      category: 'OFFICE',
      id: o.id,
      title: `${o.name} (${o.officeCode || o.code})`,
      subtitle: `${o.city}, ${o.state} | Type: ${o.officeType}`,
      url: `/admin/offices/${o.id}`,
      badge: o.officeType,
    });
  }

  for (const v of vehicles) {
    results.push({
      category: 'VEHICLE',
      id: v.id,
      title: `Vehicle: ${v.vehicleNumber}`,
      subtitle: `Reg: ${v.registrationNumber} | Type: ${v.vehicleType}`,
      url: `/admin/vehicles/${v.id}`,
      badge: v.status,
    });
  }

  for (const r of routes) {
    results.push({
      category: 'ROUTE',
      id: r.id,
      title: `Route: ${r.routeCode || `${r.originOffice.city} ➔ ${r.destinationOffice.city}`}`,
      subtitle: `${r.originOffice.name} to ${r.destinationOffice.name} (${r.distanceKm} km)`,
      url: `/admin/routes/${r.id}`,
      badge: r.routeStatus,
    });
  }

  return results;
}
