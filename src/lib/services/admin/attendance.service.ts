import { prisma } from '@/lib/db';
import { AttendanceStatus } from '@prisma/client';

export interface ClockInInput {
  employeeId: string;
  date?: string; // YYYY-MM-DD
  remarks?: string;
}

export async function clockIn(input: ClockInInput) {
  const dateStr = input.date || new Date().toISOString().split('T')[0];
  const now = new Date();

  return prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: input.employeeId,
        date: dateStr,
      },
    },
    update: {
      clockIn: now,
      status: AttendanceStatus.PRESENT,
      remarks: input.remarks,
    },
    create: {
      employeeId: input.employeeId,
      date: dateStr,
      clockIn: now,
      status: AttendanceStatus.PRESENT,
      remarks: input.remarks,
    },
  });
}

export async function clockOut(employeeId: string, dateStr?: string, breakMins: number = 0) {
  const date = dateStr || new Date().toISOString().split('T')[0];
  const now = new Date();

  return prisma.attendance.update({
    where: {
      employeeId_date: {
        employeeId,
        date,
      },
    },
    data: {
      clockOut: now,
      breakDurationMins: breakMins,
    },
  });
}

export async function getDailyAttendance(dateStr?: string) {
  const date = dateStr || new Date().toISOString().split('T')[0];

  const employees = await prisma.user.findMany({
    where: { isActive: true, role: { in: ['EMPLOYEE', 'ADMIN', 'MANAGER', 'COUNTER_EMPLOYEE'] } },
    select: {
      id: true,
      name: true,
      employeeCode: true,
      designation: true,
      office: { select: { name: true } },
      attendances: {
        where: { date },
      },
    },
  });

  return employees.map((emp) => {
    const att = emp.attendances[0];
    return {
      employeeId: emp.id,
      name: emp.name,
      employeeCode: emp.employeeCode,
      designation: emp.designation,
      officeName: emp.office?.name || 'Unassigned',
      status: att ? att.status : AttendanceStatus.ABSENT,
      clockIn: att?.clockIn || null,
      clockOut: att?.clockOut || null,
      breakMins: att?.breakDurationMins || 0,
      remarks: att?.remarks || null,
    };
  });
}
