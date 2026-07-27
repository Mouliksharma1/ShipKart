import { prisma } from '@/lib/db';
import { RouteStatus } from '@prisma/client';
import { generateSequentialNumber } from './sequential-number';

export interface CreateRouteInput {
  originOfficeId: string;
  destinationOfficeId: string;
  etaHours?: number;
  distanceKm?: number;
  operatingDays?: string;
  departureTime?: string;
  arrivalTime?: string;
  isBidirectional?: boolean;
  routeStatus?: RouteStatus;
  effectiveFrom?: Date;
  effectiveTill?: Date;
  closureReason?: string;
  pricingGroupId?: string;
}

export async function createRoute(input: CreateRouteInput) {
  if (input.originOfficeId === input.destinationOfficeId) {
    throw new Error('Origin and Destination offices cannot be identical.');
  }

  const routeCode = await generateSequentialNumber('ROUTE');

  const existing = await prisma.routeMaster.findUnique({
    where: {
      originOfficeId_destinationOfficeId: {
        originOfficeId: input.originOfficeId,
        destinationOfficeId: input.destinationOfficeId,
      },
    },
  });

  if (existing) {
    throw new Error('Route already exists for this origin and destination pair.');
  }

  const primaryRoute = await prisma.routeMaster.create({
    data: {
      routeCode,
      originOfficeId: input.originOfficeId,
      destinationOfficeId: input.destinationOfficeId,
      etaHours: input.etaHours || 12.0,
      distanceKm: input.distanceKm || 100.0,
      operatingDays: input.operatingDays || 'Daily',
      departureTime: input.departureTime || '08:00 PM',
      arrivalTime: input.arrivalTime || '06:00 AM',
      isBidirectional: input.isBidirectional ?? true,
      status: (input.routeStatus || RouteStatus.ACTIVE) === RouteStatus.ACTIVE,
      routeStatus: input.routeStatus || RouteStatus.ACTIVE,
      effectiveFrom: input.effectiveFrom,
      effectiveTill: input.effectiveTill,
      closureReason: input.closureReason,
      pricingGroupId: input.pricingGroupId || null,
      isActive: true,
    },
  });

  // Automatically create reverse route if bidirectional
  if (input.isBidirectional ?? true) {
    const reverseExisting = await prisma.routeMaster.findUnique({
      where: {
        originOfficeId_destinationOfficeId: {
          originOfficeId: input.destinationOfficeId,
          destinationOfficeId: input.originOfficeId,
        },
      },
    });

    if (!reverseExisting) {
      const reverseCode = await generateSequentialNumber('ROUTE');
      await prisma.routeMaster.create({
        data: {
          routeCode: reverseCode,
          originOfficeId: input.destinationOfficeId,
          destinationOfficeId: input.originOfficeId,
          etaHours: input.etaHours || 12.0,
          distanceKm: input.distanceKm || 100.0,
          operatingDays: input.operatingDays || 'Daily',
          departureTime: input.departureTime || '08:00 PM',
          arrivalTime: input.arrivalTime || '06:00 AM',
          isBidirectional: true,
          status: (input.routeStatus || RouteStatus.ACTIVE) === RouteStatus.ACTIVE,
          routeStatus: input.routeStatus || RouteStatus.ACTIVE,
          effectiveFrom: input.effectiveFrom,
          effectiveTill: input.effectiveTill,
          closureReason: input.closureReason,
          pricingGroupId: input.pricingGroupId || null,
          isActive: true,
        },
      });
    }
  }

  return primaryRoute;
}

export async function updateRoute(id: string, input: Partial<CreateRouteInput>) {
  const isCurrentlyActive = input.routeStatus === RouteStatus.ACTIVE;
  return prisma.routeMaster.update({
    where: { id },
    data: {
      ...input,
      status: input.routeStatus ? isCurrentlyActive : undefined,
    },
  });
}

export async function archiveRoute(id: string) {
  const route = await prisma.routeMaster.findUnique({
    where: { id },
    include: {
      dispatches: { where: { status: { in: ['CREATED', 'READY', 'DEPARTED'] } } },
    },
  });

  if (!route) throw new Error('Route not found');
  if (route.dispatches.length > 0) {
    throw new Error(`Cannot archive route with ${route.dispatches.length} active dispatches.`);
  }

  return prisma.routeMaster.update({
    where: { id },
    data: {
      isActive: false,
      status: false,
      routeStatus: RouteStatus.CLOSED,
      deletedAt: new Date(),
    },
  });
}

export async function restoreRoute(id: string) {
  return prisma.routeMaster.update({
    where: { id },
    data: {
      isActive: true,
      status: true,
      routeStatus: RouteStatus.ACTIVE,
      deletedAt: null,
    },
  });
}

export async function getRoutes(params?: {
  includeArchived?: boolean;
  search?: string;
  routeStatus?: RouteStatus;
}) {
  const where: any = {};
  if (!params?.includeArchived) {
    where.isActive = true;
  }
  if (params?.routeStatus) {
    where.routeStatus = params.routeStatus;
  }

  return prisma.routeMaster.findMany({
    where,
    include: {
      originOffice: { select: { id: true, name: true, city: true, officeCode: true } },
      destinationOffice: { select: { id: true, name: true, city: true, officeCode: true } },
      pricingGroup: { select: { id: true, name: true, version: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
