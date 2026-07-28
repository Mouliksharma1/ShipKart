import { db as prisma } from '@/lib/db';
import { AlertSeverity, AlertStatus } from '@prisma/client';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export async function generateAlerts() {
  const alertsToCreate: Array<{
    alertNumber: string;
    severity: AlertSeverity;
    module: string;
    title: string;
    description: string;
    bookingId?: string;
    dispatchId?: string;
    officeId?: string;
  }> = [];

  const timestamp = Date.now();

  // 1. Check Delayed Bookings
  const delayedBookings = await prisma.booking.findMany({
    where: { status: 'DELAYED' },
    take: 5
  }).catch(() => []);

  for (const b of delayedBookings) {
    alertsToCreate.push({
      alertNumber: `ALT-BOOK-${b.lrNumber}-${timestamp}`,
      severity: 'HIGH' as AlertSeverity,
      module: 'BOOKING',
      title: `Shipment Delayed: LR #${b.lrNumber}`,
      description: `Parcel shipment LR #${b.lrNumber} is currently marked DELAYED.`,
      bookingId: b.id,
      officeId: b.originOfficeId
    });
  }

  // 2. Check Pending Collections (> 10 items)
  const pendingCollectionCount = await prisma.booking.count({
    where: { paymentType: 'TO_PAY' as any, paymentStatus: 'PENDING' as any, status: { notIn: ['CANCELLED' as any] } }
  }).catch(() => 0);


  if (pendingCollectionCount > 10) {
    alertsToCreate.push({
      alertNumber: `ALT-COLL-${timestamp}`,
      severity: 'MEDIUM' as AlertSeverity,
      module: 'FINANCE',
      title: 'High Pending Collections Threshold Exceeded',
      description: `There are currently ${pendingCollectionCount} pending To-Pay collections requiring reconciliation.`
    });
  }

  // Save new alerts ignoring unique conflicts
  for (const alt of alertsToCreate) {
    await prisma.operationalAlert.create({
      data: alt
    }).catch(() => null);
  }
}

export async function getActiveAlerts(filters?: { severity?: AlertSeverity; officeId?: string }) {
  try {
    const whereClause: any = { status: { in: ['ACTIVE', 'ACKNOWLEDGED'] } };
    if (filters?.severity) whereClause.severity = filters.severity;
    if (filters?.officeId) whereClause.officeId = filters.officeId;

    return await prisma.operationalAlert.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } catch (err) {
    return [];
  }
}

export async function acknowledgeAlert(id: string, userId: string, userName?: string) {
  const alert = await prisma.operationalAlert.update({
    where: { id },
    data: {
      status: 'ACKNOWLEDGED' as AlertStatus,
      acknowledgedAt: new Date(),
      acknowledgedBy: userId
    }
  });

  await createActivityLog({
    userId,
    module: 'MONITORING',
    entity: 'OperationalAlert',
    entityId: alert.id,
    action: 'ACKNOWLEDGE',
    officeId: alert.officeId || undefined
  }).catch(() => null);

  return alert;
}

export async function resolveAlert(id: string, userId: string, userName?: string) {
  const alert = await prisma.operationalAlert.update({
    where: { id },
    data: {
      status: 'RESOLVED' as AlertStatus,
      resolvedAt: new Date(),
      resolvedBy: userId
    }
  });

  await createActivityLog({
    userId,
    module: 'MONITORING',
    entity: 'OperationalAlert',
    entityId: alert.id,
    action: 'RESOLVE',
    officeId: alert.officeId || undefined
  }).catch(() => null);

  return alert;
}


export async function getAlertStatistics() {
  try {
    const [active, acknowledged, resolved, critical] = await Promise.all([
      prisma.operationalAlert.count({ where: { status: 'ACTIVE' } }),
      prisma.operationalAlert.count({ where: { status: 'ACKNOWLEDGED' } }),
      prisma.operationalAlert.count({ where: { status: 'RESOLVED' } }),
      prisma.operationalAlert.count({ where: { status: 'ACTIVE', severity: 'CRITICAL' } })
    ]);

    return { active, acknowledged, resolved, critical };
  } catch (err) {
    return { active: 0, acknowledged: 0, resolved: 0, critical: 0 };
  }
}
