'use server';

import {
  bulkArchiveEntities,
  bulkRestoreEntities,
  bulkAssignOffice,
  bulkAssignRole,
  EntityType,
} from '@/lib/services/admin/bulk-operation.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function bulkArchiveMasterAction(userId: string, entityType: EntityType, ids: string[]) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_DELETE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const results = await bulkArchiveEntities(entityType, ids);
    await createActivityLog({
      userId,
      module: 'BULK_OPERATIONS',
      entity: entityType,
      activityType: ActivityType.DELETE,
      severity: ActivitySeverity.WARNING,
      action: `Bulk archived ${ids.length} records in ${entityType}`,
    });
    revalidatePath('/admin');
    return { success: true, results };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function bulkRestoreMasterAction(userId: string, entityType: EntityType, ids: string[]) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const results = await bulkRestoreEntities(entityType, ids);
    await createActivityLog({
      userId,
      module: 'BULK_OPERATIONS',
      entity: entityType,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Bulk restored ${ids.length} records in ${entityType}`,
    });
    revalidatePath('/admin');
    return { success: true, results };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function bulkAssignOfficeAction(userId: string, employeeIds: string[], officeId: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const res = await bulkAssignOffice(employeeIds, officeId);
    await createActivityLog({
      userId,
      module: 'BULK_OPERATIONS',
      entity: 'EMPLOYEE',
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Bulk assigned ${res.count} employees to officeId: ${officeId}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, count: res.count };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function bulkAssignRoleAction(userId: string, employeeIds: string[], role: Role) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const res = await bulkAssignRole(employeeIds, role);
    await createActivityLog({
      userId,
      module: 'BULK_OPERATIONS',
      entity: 'EMPLOYEE',
      activityType: ActivityType.PERMISSION_CHANGE,
      severity: ActivitySeverity.WARNING,
      action: `Bulk assigned role [${role}] to ${res.count} employees`,
    });
    revalidatePath('/admin/employees');
    return { success: true, count: res.count };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
