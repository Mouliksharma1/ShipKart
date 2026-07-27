import { prisma } from '@/lib/db';
import { OfficeType } from '@prisma/client';
import { generateSequentialNumber } from './sequential-number';

export interface CreateOfficeInput {
  name: string;
  code?: string;
  officeType?: OfficeType;
  parentOfficeId?: string;
  address: string;
  city: string;
  state?: string;
  pinCode?: string;
  phone: string;
  altPhone?: string;
  managerName?: string;
  managerPhone?: string;
  managerEmail?: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  openingTime?: string;
  closingTime?: string;
  workingDays?: string;
  maximumStorageCapacity?: number;
  gstDoc?: string;
  panDoc?: string;
  images?: string[];
}

export async function createOffice(input: CreateOfficeInput) {
  const officeCode = await generateSequentialNumber('OFF');
  const code = input.code || input.name.substring(0, 3).toUpperCase() + '01';

  return prisma.officeMaster.create({
    data: {
      officeCode,
      name: input.name,
      code,
      officeType: input.officeType || OfficeType.BRANCH,
      parentOfficeId: input.parentOfficeId || null,
      address: input.address,
      city: input.city,
      state: input.state || 'Rajasthan',
      pinCode: input.pinCode || '342001',
      phone: input.phone,
      altPhone: input.altPhone,
      managerName: input.managerName,
      managerPhone: input.managerPhone,
      managerEmail: input.managerEmail,
      latitude: input.latitude,
      longitude: input.longitude,
      googleMapsUrl: input.googleMapsUrl,
      openingTime: input.openingTime || '04:00 AM',
      closingTime: input.closingTime || '11:00 PM',
      officeTiming: `${input.openingTime || '04:00 AM'} - ${input.closingTime || '11:00 PM'}`,
      workingDays: input.workingDays || 'Mon-Sat',
      maximumStorageCapacity: input.maximumStorageCapacity || 1000,
      gstDoc: input.gstDoc,
      panDoc: input.panDoc,
      images: input.images || [],
    },
  });
}

export async function updateOffice(id: string, input: Partial<CreateOfficeInput>) {
  return prisma.officeMaster.update({
    where: { id },
    data: {
      ...input,
      officeTiming: input.openingTime || input.closingTime ? `${input.openingTime || '04:00 AM'} - ${input.closingTime || '11:00 PM'}` : undefined,
    },
  });
}

export async function archiveOffice(id: string, deletedBy?: string) {
  const office = await prisma.officeMaster.findUnique({
    where: { id },
    include: {
      users: { where: { isActive: true } },
      originBookings: { where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } } },
    },
  });

  if (!office) throw new Error('Office not found');
  if (office.officeType === OfficeType.HEAD_OFFICE) {
    throw new Error('Head Office cannot be archived.');
  }
  if (office.users.length > 0) {
    throw new Error(`Cannot archive office with ${office.users.length} active employees. Reassign employees first.`);
  }
  if (office.originBookings.length > 0) {
    throw new Error(`Cannot archive office with ${office.originBookings.length} active bookings.`);
  }

  return prisma.officeMaster.update({
    where: { id },
    data: {
      isActive: false,
      status: false,
      deletedAt: new Date(),
      deletedBy: deletedBy || 'ADMIN',
    },
  });
}

export async function restoreOffice(id: string) {
  return prisma.officeMaster.update({
    where: { id },
    data: {
      isActive: true,
      status: true,
      deletedAt: null,
      deletedBy: null,
    },
  });
}

export async function getOffices(params?: {
  includeArchived?: boolean;
  search?: string;
  officeType?: OfficeType;
}) {
  const where: any = {};
  if (!params?.includeArchived) {
    where.isActive = true;
  }
  if (params?.officeType) {
    where.officeType = params.officeType;
  }
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { city: { contains: params.search, mode: 'insensitive' } },
      { officeCode: { contains: params.search, mode: 'insensitive' } },
      { code: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  return prisma.officeMaster.findMany({
    where,
    include: {
      parentOffice: { select: { id: true, name: true, officeType: true } },
      subOffices: { select: { id: true, name: true, officeType: true } },
      _count: { select: { users: true, originBookings: true } },
    },
    orderBy: { name: 'asc' },
  });
}
