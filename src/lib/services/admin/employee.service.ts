import { prisma } from '@/lib/db';
import { Role, EmployeeStatus } from '@prisma/client';
import { generateSequentialNumber } from './sequential-number';

export interface CreateEmployeeInput {
  name: string;
  phone: string;
  email?: string;
  username?: string;
  password?: string;
  role?: Role;
  designation?: string;
  officeId?: string;
  emergencyContact?: string;
  aadhaarDoc?: string;
  panDoc?: string;
  drivingLicenseDoc?: string;
}

export async function createEmployee(input: CreateEmployeeInput) {
  const employeeCode = await generateSequentialNumber('EMP');

  const existingPhone = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (existingPhone) {
    throw new Error(`User with phone number ${input.phone} already exists.`);
  }

  return prisma.user.create({
    data: {
      employeeCode,
      username: input.username || input.phone,
      password: input.password || 'Pooja@123',

      name: input.name,
      phone: input.phone,
      email: input.email || null,
      role: input.role || Role.EMPLOYEE,
      designation: input.designation || 'Staff',
      officeId: input.officeId || null,
      emergencyContact: input.emergencyContact,
      aadhaarDoc: input.aadhaarDoc,
      panDoc: input.panDoc,
      drivingLicenseDoc: input.drivingLicenseDoc,
      passwordResetRequired: false,
      joiningDate: new Date(),
      employeeStatus: EmployeeStatus.ACTIVE,
      status: true,
      isActive: true,
    },
  });

}

export async function updateEmployee(id: string, input: Partial<CreateEmployeeInput>) {
  return prisma.user.update({
    where: { id },
    data: input,
  });
}

export async function lockEmployeeAccount(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      accountLocked: true,
    },
  });
}

export async function unlockEmployeeAccount(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      accountLocked: false,
      failedLoginAttempts: 0,
    },
  });
}

export async function forcePasswordReset(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      passwordResetRequired: true,
    },
  });
}

export async function archiveEmployee(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      isActive: false,
      status: false,
      employeeStatus: EmployeeStatus.INACTIVE,
      deletedAt: new Date(),
    },
  });
}

export async function restoreEmployee(id: string) {
  return prisma.user.update({
    where: { id },
    data: {
      isActive: true,
      status: true,
      employeeStatus: EmployeeStatus.ACTIVE,
      deletedAt: null,
    },
  });
}

export async function getEmployees(params?: {
  includeArchived?: boolean;
  search?: string;
  officeId?: string;
  role?: Role;
}) {
  const where: any = {};
  if (!params?.includeArchived) {
    where.isActive = true;
  }
  if (params?.officeId) {
    where.officeId = params.officeId;
  }
  if (params?.role) {
    where.role = params.role;
  } else {
    where.role = { not: Role.CUSTOMER };
  }
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { phone: { contains: params.search, mode: 'insensitive' } },
      { employeeCode: { contains: params.search, mode: 'insensitive' } },
      { designation: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    include: {
      office: { select: { id: true, name: true, city: true } },
      attendances: { take: 1, orderBy: { createdAt: 'desc' } },
    },
    orderBy: { name: 'asc' },
  });
}
