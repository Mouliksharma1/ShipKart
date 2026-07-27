import { archiveOffice, restoreOffice } from './office.service';
import { archiveEmployee, restoreEmployee } from './employee.service';
import { archiveVehicle, restoreVehicle } from './vehicle.service';
import { archiveRoute, restoreRoute } from './route.service';
import { archivePricingVersion, restorePricingVersion } from './pricing.service';
import { prisma } from '@/lib/db';
import { Role } from '@prisma/client';

export type EntityType = 'OFFICE' | 'EMPLOYEE' | 'VEHICLE' | 'ROUTE' | 'PRICING';

export async function bulkArchiveEntities(entityType: EntityType, ids: string[]) {
  const results = [];
  for (const id of ids) {
    try {
      if (entityType === 'OFFICE') await archiveOffice(id);
      else if (entityType === 'EMPLOYEE') await archiveEmployee(id);
      else if (entityType === 'VEHICLE') await archiveVehicle(id);
      else if (entityType === 'ROUTE') await archiveRoute(id);
      else if (entityType === 'PRICING') await archivePricingVersion(id);
      results.push({ id, success: true });
    } catch (err: any) {
      results.push({ id, success: false, error: err.message });
    }
  }
  return results;
}

export async function bulkRestoreEntities(entityType: EntityType, ids: string[]) {
  const results = [];
  for (const id of ids) {
    try {
      if (entityType === 'OFFICE') await restoreOffice(id);
      else if (entityType === 'EMPLOYEE') await restoreEmployee(id);
      else if (entityType === 'VEHICLE') await restoreVehicle(id);
      else if (entityType === 'ROUTE') await restoreRoute(id);
      else if (entityType === 'PRICING') await restorePricingVersion(id);
      results.push({ id, success: true });
    } catch (err: any) {
      results.push({ id, success: false, error: err.message });
    }
  }
  return results;
}

export async function bulkAssignOffice(employeeIds: string[], officeId: string) {
  return prisma.user.updateMany({
    where: { id: { in: employeeIds } },
    data: { officeId },
  });
}

export async function bulkAssignRole(employeeIds: string[], role: Role) {
  return prisma.user.updateMany({
    where: { id: { in: employeeIds } },
    data: { role },
  });
}
