'use server';

import {
  createVehicle,
  updateVehicle,
  addMaintenanceRecord,
  archiveVehicle,
  restoreVehicle,
  getVehicles,
  getUpcomingExpiries,
  CreateVehicleInput,
} from '@/lib/services/admin/vehicle.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity, VehicleStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createVehicleAction(input: CreateVehicleInput, userId?: string) {
  if (userId) {
    const allowed = await hasPermission(userId, PERMISSION_CODES.VEHICLES_MANAGE);
    if (!allowed) return { success: false, error: 'Unauthorized: Missing vehicles:manage permission.' };
  }

  try {
    const vehicle = await createVehicle(input);
    if (userId) {
      try {
        await createActivityLog({
          userId,
          module: 'VEHICLE',
          entity: 'VehicleMaster',
          entityId: vehicle.id,
          activityType: ActivityType.CREATE,
          severity: ActivitySeverity.INFO,
          action: `Registered vehicle: ${vehicle.vehicleNumber}`,
          newData: vehicle,
        });
      } catch (logErr) {}
    }
    revalidatePath('/admin/vehicles');
    return { success: true, vehicle };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to register vehicle.' };
  }
}

export async function updateVehicleAction(userId: string, id: string, input: Partial<CreateVehicleInput>) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.VEHICLES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const vehicle = await updateVehicle(id, input);
    await createActivityLog({
      userId,
      module: 'VEHICLE',
      entity: 'VehicleMaster',
      entityId: vehicle.id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Updated vehicle details: ${vehicle.vehicleNumber}`,
    });
    revalidatePath('/admin/vehicles');
    return { success: true, vehicle };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function addMaintenanceRecordAction(userId: string, vehicleId: string, input: {
  serviceDate: Date;
  serviceType: string;
  cost: number;
  odometerReading?: number;
  invoiceNumber?: string;
  description?: string;
  performedBy?: string;
}) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.VEHICLES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const record = await addMaintenanceRecord(vehicleId, input);
    await createActivityLog({
      userId,
      module: 'VEHICLE_MAINTENANCE',
      entity: 'VehicleMaintenanceHistory',
      entityId: record.id,
      activityType: ActivityType.CREATE,
      severity: ActivitySeverity.INFO,
      action: `Added maintenance record for vehicle (${record.serviceType}, Cost: ₹${record.cost})`,
    });
    revalidatePath('/admin/vehicles');
    return { success: true, record };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function archiveVehicleAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.VEHICLES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const vehicle = await archiveVehicle(id);
    await createActivityLog({
      userId,
      module: 'VEHICLE',
      entity: 'VehicleMaster',
      entityId: id,
      activityType: ActivityType.DELETE,
      severity: ActivitySeverity.WARNING,
      action: `Archived vehicle: ${vehicle.vehicleNumber}`,
    });
    revalidatePath('/admin/vehicles');
    return { success: true, vehicle };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreVehicleAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.VEHICLES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const vehicle = await restoreVehicle(id);
    await createActivityLog({
      userId,
      module: 'VEHICLE',
      entity: 'VehicleMaster',
      entityId: id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Restored vehicle: ${vehicle.vehicleNumber}`,
    });
    revalidatePath('/admin/vehicles');
    return { success: true, vehicle };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getVehiclesAction(params?: { includeArchived?: boolean; search?: string; status?: VehicleStatus }) {
  try {
    const vehicles = await getVehicles(params);
    return { success: true, vehicles };
  } catch (err: any) {
    return { success: false, error: err.message, vehicles: [] };
  }
}

export async function getUpcomingExpiriesAction(daysThreshold: number = 30) {
  try {
    const expiringVehicles = await getUpcomingExpiries(daysThreshold);
    return { success: true, expiringVehicles };
  } catch (err: any) {
    return { success: false, error: err.message, expiringVehicles: [] };
  }
}
