'use server';

import { createOffice, updateOffice, archiveOffice, restoreOffice, getOffices, CreateOfficeInput } from '@/lib/services/admin/office.service';
import { createHoliday, deleteHoliday, getHolidays } from '@/lib/services/admin/holiday.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity, OfficeType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createOfficeAction(userId: string, input: CreateOfficeInput) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_MANAGE);
  if (!allowed) {
    return { success: false, error: 'Unauthorized: Missing offices:manage permission.' };
  }

  try {
    const office = await createOffice(input);
    await createActivityLog({
      userId,
      module: 'OFFICE',
      entity: 'OfficeMaster',
      entityId: office.id,
      activityType: ActivityType.CREATE,
      severity: ActivitySeverity.INFO,
      action: `Created office: ${office.name} (${office.officeCode})`,
      newData: office,
    });
    revalidatePath('/admin/offices');
    return { success: true, office };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateOfficeAction(userId: string, id: string, input: Partial<CreateOfficeInput>) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_MANAGE);
  if (!allowed) {
    return { success: false, error: 'Unauthorized: Missing offices:manage permission.' };
  }

  try {
    const office = await updateOffice(id, input);
    await createActivityLog({
      userId,
      module: 'OFFICE',
      entity: 'OfficeMaster',
      entityId: office.id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Updated office: ${office.name}`,
      newData: office,
    });
    revalidatePath('/admin/offices');
    return { success: true, office };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function archiveOfficeAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_DELETE);
  if (!allowed) {
    return { success: false, error: 'Unauthorized: Missing offices:delete permission.' };
  }

  try {
    const office = await archiveOffice(id, userId);
    await createActivityLog({
      userId,
      module: 'OFFICE',
      entity: 'OfficeMaster',
      entityId: office.id,
      activityType: ActivityType.DELETE,
      severity: ActivitySeverity.WARNING,
      action: `Archived office: ${office.name}`,
    });
    revalidatePath('/admin/offices');
    return { success: true, office };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreOfficeAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_MANAGE);
  if (!allowed) {
    return { success: false, error: 'Unauthorized: Missing offices:manage permission.' };
  }

  try {
    const office = await restoreOffice(id);
    await createActivityLog({
      userId,
      module: 'OFFICE',
      entity: 'OfficeMaster',
      entityId: office.id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Restored office: ${office.name}`,
    });
    revalidatePath('/admin/offices');
    return { success: true, office };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getOfficesAction(params?: { includeArchived?: boolean; search?: string; officeType?: OfficeType }) {
  try {
    const offices = await getOffices(params);
    return { success: true, offices };
  } catch (err: any) {
    return { success: false, error: err.message, offices: [] };
  }
}

export async function addHolidayAction(userId: string, input: { officeId?: string; holidayDate: string; title: string; description?: string }) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const holiday = await createHoliday(input);
    revalidatePath('/admin/offices');
    return { success: true, holiday };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteHolidayAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.OFFICES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    await deleteHoliday(id);
    revalidatePath('/admin/offices');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
