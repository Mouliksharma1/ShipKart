'use server';

import {
  getCategorizedSettings,
  updateCompanySettings,
  updateBookingSettings,
  updateBrandingSettings,
  updateNotificationSettings,
  updateFinanceSettings,
  updateSecuritySettings,
  updateSystemSettings,
  exportSettingsJSON,
  importSettingsJSON,
} from '@/lib/services/admin/settings.service';
import { getFeatureFlags, toggleFeatureFlag } from '@/lib/services/admin/feature-flag.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getSettingsAction() {
  try {
    const settings = await getCategorizedSettings();
    const flags = await getFeatureFlags();
    return { success: true, settings, flags };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateCategorySettingsAction(userId: string, category: 'company' | 'booking' | 'branding' | 'notification' | 'finance' | 'security' | 'system', data: any) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.SETTINGS_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized: Missing settings:manage permission.' };

  try {
    let result;
    if (category === 'company') result = await updateCompanySettings(data);
    else if (category === 'booking') result = await updateBookingSettings(data);
    else if (category === 'branding') result = await updateBrandingSettings(data);
    else if (category === 'notification') result = await updateNotificationSettings(data);
    else if (category === 'finance') result = await updateFinanceSettings(data);
    else if (category === 'security') result = await updateSecuritySettings(data);
    else if (category === 'system') result = await updateSystemSettings(data);

    await createActivityLog({
      userId,
      module: 'SETTINGS',
      entity: 'SystemSettings',
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Updated settings category: ${category}`,
      newData: data,
    });
    revalidatePath('/admin/settings');
    return { success: true, result };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function toggleFeatureFlagAction(userId: string, key: string, enabled: boolean) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.SETTINGS_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const flag = await toggleFeatureFlag(key, enabled);
    await createActivityLog({
      userId,
      module: 'FEATURE_FLAGS',
      entity: 'FeatureFlag',
      entityId: flag.id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.WARNING,
      action: `Toggled feature flag [${key}] to ${enabled ? 'ENABLED' : 'DISABLED'}`,
    });
    revalidatePath('/admin/settings');
    return { success: true, flag };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function exportBackupAction(userId: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.SYSTEM_BACKUP);
  if (!allowed) return { success: false, error: 'Unauthorized: Missing system:backup permission.' };

  try {
    const jsonStr = await exportSettingsJSON();
    await createActivityLog({
      userId,
      module: 'SYSTEM_BACKUP',
      entity: 'Backup',
      activityType: ActivityType.SYSTEM,
      severity: ActivitySeverity.INFO,
      action: 'Exported full system configuration backup',
    });
    return { success: true, backupJSON: jsonStr };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreBackupAction(userId: string, jsonStr: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.SYSTEM_BACKUP);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    await importSettingsJSON(jsonStr);
    await createActivityLog({
      userId,
      module: 'SYSTEM_BACKUP',
      entity: 'Backup',
      activityType: ActivityType.SYSTEM,
      severity: ActivitySeverity.CRITICAL,
      action: 'Restored system configuration backup from uploaded JSON',
    });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
