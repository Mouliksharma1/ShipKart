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

export async function lockEmployeeAccountAction(targetEmployeeId: string, adminUserId?: string) {
  if (adminUserId) {
    const allowed = await hasPermission(adminUserId, PERMISSION_CODES.EMPLOYEES_SECURITY);
    if (!allowed) return { success: false, error: 'Unauthorized: Missing employees:security permission.' };
  }

  try {
    const employee = await lockEmployeeAccount(targetEmployeeId);
    if (adminUserId) {
      try {
        await createActivityLog({
          userId: adminUserId,
          module: 'EMPLOYEE_SECURITY',
          entity: 'User',
          entityId: targetEmployeeId,
          activityType: ActivityType.PERMISSION_CHANGE,
          severity: ActivitySeverity.WARNING,
          action: `Locked employee account for: ${employee.name}`,
        });
      } catch (logErr) {}
    }
    revalidatePath('/admin/employees');
    revalidatePath(`/admin/employees/${targetEmployeeId}`);
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to lock account' };
  }
}

export async function unlockEmployeeAccountAction(targetEmployeeId: string, adminUserId?: string) {
  if (adminUserId) {
    const allowed = await hasPermission(adminUserId, PERMISSION_CODES.EMPLOYEES_SECURITY);
    if (!allowed) return { success: false, error: 'Unauthorized' };
  }

  try {
    const employee = await unlockEmployeeAccount(targetEmployeeId);
    if (adminUserId) {
      try {
        await createActivityLog({
          userId: adminUserId,
          module: 'EMPLOYEE_SECURITY',
          entity: 'User',
          entityId: targetEmployeeId,
          activityType: ActivityType.PERMISSION_CHANGE,
          severity: ActivitySeverity.INFO,
          action: `Unlocked employee account for: ${employee.name}`,
        });
      } catch (logErr) {}
    }
    revalidatePath('/admin/employees');
    revalidatePath(`/admin/employees/${targetEmployeeId}`);
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to unlock account' };
  }
}

export async function forcePasswordResetAction(targetEmployeeId: string, adminUserId?: string) {
  if (adminUserId) {
    const allowed = await hasPermission(adminUserId, PERMISSION_CODES.EMPLOYEES_SECURITY);
    if (!allowed) return { success: false, error: 'Unauthorized' };
  }

  try {
    const employee = await forcePasswordReset(targetEmployeeId);
    if (adminUserId) {
      try {
        await createActivityLog({
          userId: adminUserId,
          module: 'EMPLOYEE_SECURITY',
          entity: 'User',
          entityId: targetEmployeeId,
          activityType: ActivityType.PERMISSION_CHANGE,
          severity: ActivitySeverity.INFO,
          action: `Forced password reset for: ${employee.name}`,
        });
      } catch (logErr) {}
    }
    revalidatePath('/admin/employees');
    revalidatePath(`/admin/employees/${targetEmployeeId}`);
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to force password reset' };
  }
}

export async function archiveEmployeeAction(id: string, userId?: string) {
  if (userId) {
    const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
    if (!allowed) return { success: false, error: 'Unauthorized' };
  }

  try {
    const employee = await archiveEmployee(id);
    if (userId) {
      try {
        await createActivityLog({
          userId,
          module: 'EMPLOYEE',
          entity: 'User',
          entityId: id,
          activityType: ActivityType.DELETE,
          severity: ActivitySeverity.WARNING,
          action: `Archived employee: ${employee.name}`,
        });
      } catch (logErr) {}
    }
    revalidatePath('/admin/employees');
    revalidatePath(`/admin/employees/${id}`);
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to archive employee' };
  }
}

export async function restoreEmployeeAction(id: string, userId?: string) {
  if (userId) {
    const allowed = await hasPermission(userId, PERMISSION_CODES.EMPLOYEES_MANAGE);
    if (!allowed) return { success: false, error: 'Unauthorized' };
  }

  try {
    const employee = await restoreEmployee(id);
    if (userId) {
      try {
        await createActivityLog({
          userId,
          module: 'EMPLOYEE',
          entity: 'User',
          entityId: id,
          activityType: ActivityType.UPDATE,
          severity: ActivitySeverity.INFO,
          action: `Restored employee: ${employee.name}`,
        });
      } catch (logErr) {}
    }
    revalidatePath('/admin/employees');
    revalidatePath(`/admin/employees/${id}`);
    return { success: true, employee };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to restore employee' };
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
