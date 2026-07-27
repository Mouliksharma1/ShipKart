'use server';

import {
  createPricingVersion,
  activatePricingVersion,
  archivePricingVersion,
  restorePricingVersion,
  getPricingVersions,
  getActivePricingGroup,
  CreatePricingVersionInput,
} from '@/lib/services/admin/pricing.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createPricingVersionAction(userId: string, input: CreatePricingVersionInput) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.PRICING_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized: Missing pricing:manage permission.' };

  try {
    const pricing = await createPricingVersion(input);
    await createActivityLog({
      userId,
      module: 'PRICING',
      entity: 'PricingGroup',
      entityId: pricing.id,
      activityType: ActivityType.CREATE,
      severity: ActivitySeverity.INFO,
      action: `Created pricing group version ${pricing.version} (${pricing.name})`,
      newData: pricing,
    });
    revalidatePath('/admin/pricing');
    return { success: true, pricing };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function activatePricingVersionAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.PRICING_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const pricing = await activatePricingVersion(id);
    await createActivityLog({
      userId,
      module: 'PRICING',
      entity: 'PricingGroup',
      entityId: id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.CRITICAL,
      action: `Activated single pricing group version v${pricing.version} (${pricing.name}). All other pricing versions locked/deactivated.`,
    });
    revalidatePath('/admin/pricing');
    return { success: true, pricing };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function archivePricingVersionAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.PRICING_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const pricing = await archivePricingVersion(id);
    await createActivityLog({
      userId,
      module: 'PRICING',
      entity: 'PricingGroup',
      entityId: id,
      activityType: ActivityType.DELETE,
      severity: ActivitySeverity.WARNING,
      action: `Archived pricing version v${pricing.version}`,
    });
    revalidatePath('/admin/pricing');
    return { success: true, pricing };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restorePricingVersionAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.PRICING_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const pricing = await restorePricingVersion(id);
    await createActivityLog({
      userId,
      module: 'PRICING',
      entity: 'PricingGroup',
      entityId: id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Restored pricing version v${pricing.version}`,
    });
    revalidatePath('/admin/pricing');
    return { success: true, pricing };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPricingVersionsAction() {
  try {
    const versions = await getPricingVersions();
    const active = await getActivePricingGroup();
    return { success: true, versions, active };
  } catch (err: any) {
    return { success: false, error: err.message, versions: [], active: null };
  }
}
