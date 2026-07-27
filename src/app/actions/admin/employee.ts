'use server';

import {
  createEmployee,
  updateEmployee,
  lockEmployeeAccount,
  unlockEmployeeAccount,
  forcePasswordReset,
  archiveEmployee,
  restoreEmployee,
  getEmployees,
  CreateEmployeeInput,
} from '@/lib/services/admin/employee.service';
import { clockIn, clockOut, getDailyAttendance } from '@/lib/services/admin/attendance.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';
import { hasPermission, PERMISSION_CODES } from '@/lib/services/admin/rbac.service';
import { ActivityType, ActivitySeverity, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createEmployeeAction(input: CreateEmployeeInput, userId?: string) {
  if (userId) {
    const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
    if (!allowed) {
      return { success: false, error: 'Unauthorized: Missing employees:manage permission.' };
    }
  }

  try {
    const employee = await createEmployee(input);
    if (userId) {
      try {
        await createActivityLog({
          userId,
          module: 'EMPLOYEE',
          entity: 'User',
          entityId: employee.id,
          activityType: ActivityType.CREATE,
          severity: ActivitySeverity.INFO,
          action: `Created employee: ${employee.name} (${employee.employeeCode})`,
          newData: employee,
        });
      } catch (logErr) {
        console.warn('Failed to record activity log for employee creation:', logErr);
      }
    }
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create employee.' };
  }
}

export async function updateEmployeeAction(userId: string, id: string, input: Partial<CreateEmployeeInput>) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
  if (!allowed) {
    return { success: false, error: 'Unauthorized: Missing employees:manage permission.' };
  }

  try {
    const employee = await updateEmployee(id, input);
    await createActivityLog({
      userId,
      module: 'EMPLOYEE',
      entity: 'User',
      entityId: employee.id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Updated employee: ${employee.name}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function lockEmployeeAccountAction(adminUserId: string, targetEmployeeId: string) {
  const allowed = await hasPermission(adminUserId, PERMISSION_CODES.EMPLOYEES_SECURITY);
  if (!allowed) return { success: false, error: 'Unauthorized: Missing employees:security permission.' };

  try {
    const employee = await lockEmployeeAccount(targetEmployeeId);
    await createActivityLog({
      userId: adminUserId,
      module: 'EMPLOYEE_SECURITY',
      entity: 'User',
      entityId: targetEmployeeId,
      activityType: ActivityType.PERMISSION_CHANGE,
      severity: ActivitySeverity.WARNING,
      action: `Locked employee account for: ${employee.name}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function unlockEmployeeAccountAction(adminUserId: string, targetEmployeeId: string) {
  const allowed = await hasPermission(adminUserId, PERMISSION_CODES.EMPLOYEES_SECURITY);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const employee = await unlockEmployeeAccount(targetEmployeeId);
    await createActivityLog({
      userId: adminUserId,
      module: 'EMPLOYEE_SECURITY',
      entity: 'User',
      entityId: targetEmployeeId,
      activityType: ActivityType.PERMISSION_CHANGE,
      severity: ActivitySeverity.INFO,
      action: `Unlocked employee account for: ${employee.name}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function forcePasswordResetAction(adminUserId: string, targetEmployeeId: string) {
  const allowed = await hasPermission(adminUserId, PERMISSION_CODES.EMPLOYEES_SECURITY);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const employee = await forcePasswordReset(targetEmployeeId);
    await createActivityLog({
      userId: adminUserId,
      module: 'EMPLOYEE_SECURITY',
      entity: 'User',
      entityId: targetEmployeeId,
      activityType: ActivityType.PERMISSION_CHANGE,
      severity: ActivitySeverity.INFO,
      action: `Forced password reset for: ${employee.name}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function archiveEmployeeAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const employee = await archiveEmployee(id);
    await createActivityLog({
      userId,
      module: 'EMPLOYEE',
      entity: 'User',
      entityId: id,
      activityType: ActivityType.DELETE,
      severity: ActivitySeverity.WARNING,
      action: `Archived employee: ${employee.name}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function restoreEmployeeAction(userId: string, id: string) {
  const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
  if (!allowed) return { success: false, error: 'Unauthorized' };

  try {
    const employee = await restoreEmployee(id);
    await createActivityLog({
      userId,
      module: 'EMPLOYEE',
      entity: 'User',
      entityId: id,
      activityType: ActivityType.UPDATE,
      severity: ActivitySeverity.INFO,
      action: `Restored employee: ${employee.name}`,
    });
    revalidatePath('/admin/employees');
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getEmployeesAction(params?: { includeArchived?: boolean; search?: string; officeId?: string; role?: Role }) {
  try {
    const employees = await getEmployees(params);
    return { success: true, employees };
  } catch (err: any) {
    return { success: false, error: err.message, employees: [] };
  }
}

export async function recordClockInAction(employeeId: string, remarks?: string) {
  try {
    const attendance = await clockIn({ employeeId, remarks });
    revalidatePath('/admin/employees');
    return { success: true, attendance };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function recordClockOutAction(employeeId: string, breakMins: number = 0) {
  try {
    const attendance = await clockOut(employeeId, undefined, breakMins);
    revalidatePath('/admin/employees');
    return { success: true, attendance };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getDailyAttendanceAction(dateStr?: string) {
  try {
    const attendanceList = await getDailyAttendance(dateStr);
    return { success: true, attendanceList };
  } catch (err: any) {
    return { success: false, error: err.message, attendanceList: [] };
  }
}
