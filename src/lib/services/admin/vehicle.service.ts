import { prisma } from '@/lib/db';
import { VehicleStatus } from '@prisma/client';

export interface CreateVehicleInput {
  vehicleNumber: string;
  vehicleType?: string;
  registrationNumber: string;
  capacityKg?: number;
  status?: VehicleStatus;
  driverEmployeeId?: string;
  driverName?: string;
  driverPhone?: string;
  insuranceExpiry?: Date;
  permitExpiry?: Date;
  fitnessExpiry?: Date;
  pollutionExpiry?: Date;
  insuranceDoc?: string;
  registrationDoc?: string;
  fitnessDoc?: string;
  permitDoc?: string;
  pollutionDoc?: string;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  maintenanceCost?: number;
  odometer?: number;
}

export async function createVehicle(input: CreateVehicleInput) {
  const existing = await prisma.vehicleMaster.findUnique({
    where: { vehicleNumber: input.vehicleNumber },
  });

  if (existing) {
    throw new Error(`Vehicle number ${input.vehicleNumber} is already registered.`);
  }

  return prisma.vehicleMaster.create({
    data: {
      vehicleNumber: input.vehicleNumber,
      vehicleType: input.vehicleType || 'TRUCK',
      registrationNumber: input.registrationNumber,
      capacityKg: input.capacityKg || 1000.0,
      status: input.status || VehicleStatus.AVAILABLE,
      driverEmployeeId: input.driverEmployeeId || null,
      driverName: input.driverName,
      driverPhone: input.driverPhone,
      insuranceExpiry: input.insuranceExpiry,
      permitExpiry: input.permitExpiry,
      fitnessExpiry: input.fitnessExpiry,
      pollutionExpiry: input.pollutionExpiry,
      insuranceDoc: input.insuranceDoc,
      registrationDoc: input.registrationDoc,
      fitnessDoc: input.fitnessDoc,
      permitDoc: input.permitDoc,
      pollutionDoc: input.pollutionDoc,
      lastServiceDate: input.lastServiceDate,
      nextServiceDate: input.nextServiceDate,
      maintenanceCost: input.maintenanceCost || 0,
      odometer: input.odometer || 0,
      isActive: true,
    },
  });
}

export async function updateVehicle(id: string, input: Partial<CreateVehicleInput>) {
  return prisma.vehicleMaster.update({
    where: { id },
    data: input,
  });
}

export async function addMaintenanceRecord(vehicleId: string, input: {
  serviceDate: Date;
  serviceType: string;
  cost: number;
  odometerReading?: number;
  invoiceNumber?: string;
  description?: string;
  performedBy?: string;
}) {
  const record = await prisma.vehicleMaintenanceHistory.create({
    data: {
      vehicleId,
      serviceDate: input.serviceDate,
      serviceType: input.serviceType,
      cost: input.cost,
      odometerReading: input.odometerReading,
      invoiceNumber: input.invoiceNumber,
      description: input.description,
      performedBy: input.performedBy,
    },
  });

  // Update vehicle lastServiceDate & cumulative maintenance cost
  await prisma.vehicleMaster.update({
    where: { id: vehicleId },
    data: {
      lastServiceDate: input.serviceDate,
      maintenanceCost: { increment: input.cost },
      odometer: input.odometerReading ? Math.max(input.odometerReading, 0) : undefined,
    },
  });

  return record;
}

export async function archiveVehicle(id: string) {
  return prisma.vehicleMaster.update({
    where: { id },
    data: {
      isActive: false,
      status: VehicleStatus.OUT_OF_SERVICE,
      deletedAt: new Date(),
    },
  });
}

export async function restoreVehicle(id: string) {
  return prisma.vehicleMaster.update({
    where: { id },
    data: {
      isActive: true,
      status: VehicleStatus.AVAILABLE,
      deletedAt: null,
    },
  });
}

export async function getVehicles(params?: {
  includeArchived?: boolean;
  search?: string;
  status?: VehicleStatus;
}) {
  const where: any = {};
  if (!params?.includeArchived) {
    where.isActive = true;
  }
  if (params?.status) {
    where.status = params.status;
  }
  if (params?.search) {
    where.OR = [
      { vehicleNumber: { contains: params.search, mode: 'insensitive' } },
      { registrationNumber: { contains: params.search, mode: 'insensitive' } },
      { driverName: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  return prisma.vehicleMaster.findMany({
    where,
    include: {
      driverEmployee: { select: { id: true, name: true, phone: true } },
      maintenanceHistory: { orderBy: { serviceDate: 'desc' }, take: 5 },
    },
    orderBy: { vehicleNumber: 'asc' },
  });
}

export async function getUpcomingExpiries(daysThreshold: number = 30) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysThreshold);

  return prisma.vehicleMaster.findMany({
    where: {
      isActive: true,
      OR: [
        { insuranceExpiry: { lte: targetDate } },
        { permitExpiry: { lte: targetDate } },
        { fitnessExpiry: { lte: targetDate } },
        { pollutionExpiry: { lte: targetDate } },
      ],
    },
  });
}
