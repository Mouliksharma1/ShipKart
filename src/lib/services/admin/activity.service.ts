import { prisma } from '@/lib/db';
import { ActivityType, ActivitySeverity } from '@prisma/client';
import { generateSequentialNumber } from './sequential-number';

export interface CreateActivityInput {
  userId?: string;
  userRole?: string;
  officeId?: string;
  sessionId?: string;
  deviceType?: string;
  browser?: string;
  OS?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  activityType?: ActivityType;
  severity?: ActivitySeverity;
  module: string;
  entity: string;
  entityId?: string;
  action: string;
  oldData?: any;
  newData?: any;
}

export async function createActivityLog(input: CreateActivityInput) {
  try {
    const activityNumber = await generateSequentialNumber('ACT');
    return await prisma.activityLog.create({
      data: {
        activityNumber,
        userId: input.userId,
        userRole: input.userRole,
        officeId: input.officeId,
        sessionId: input.sessionId,
        deviceType: input.deviceType,
        browser: input.browser,
        OS: input.OS,
        requestId: input.requestId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        activityType: input.activityType || ActivityType.SYSTEM,
        severity: input.severity || ActivitySeverity.INFO,
        module: input.module,
        entity: input.entity,
        entityId: input.entityId,
        action: input.action,
        oldData: input.oldData ? JSON.parse(JSON.stringify(input.oldData)) : undefined,
        newData: input.newData ? JSON.parse(JSON.stringify(input.newData)) : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
}

export async function getActivityLogs(params: {
  page?: number;
  limit?: number;
  module?: string;
  severity?: ActivitySeverity;
  activityType?: ActivityType;
  search?: string;
}) {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (params.module) where.module = params.module;
  if (params.severity) where.severity = params.severity;
  if (params.activityType) where.activityType = params.activityType;
  if (params.search) {
    where.OR = [
      { action: { contains: params.search, mode: 'insensitive' } },
      { module: { contains: params.search, mode: 'insensitive' } },
      { entity: { contains: params.search, mode: 'insensitive' } },
      { activityNumber: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, phone: true, role: true } },
      },
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
