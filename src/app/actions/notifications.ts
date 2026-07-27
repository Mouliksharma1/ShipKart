'use server';

import { db } from '@/lib/db';
import {
  enqueueNotification,
  processQueue,
  cancelNotification,
  createNotificationAudit,
} from '@/lib/services/notification';
import { getNotificationMetrics } from '@/lib/services/notification-metrics';
import { renderTemplate } from '@/lib/services/template';
import {
  NotificationChannel,
  NotificationEvent,
  NotificationStatus,
  NotificationRecipientType,
  NotificationPriority,
  Role,
} from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getNotificationMetricsAction() {
  return await getNotificationMetrics();
}

export async function getNotificationQueueAction(params?: {
  status?: NotificationStatus;
  channel?: NotificationChannel;
  event?: NotificationEvent;
  query?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 20;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (params?.status) where.status = params.status;
  if (params?.channel) where.channel = params.channel;
  if (params?.event) where.event = params.event;
  if (params?.query) {
    where.OR = [
      { queueNumber: { contains: params.query, mode: 'insensitive' } },
      { lrNumber: { contains: params.query, mode: 'insensitive' } },
      { recipientName: { contains: params.query, mode: 'insensitive' } },
      { recipientPhone: { contains: params.query, mode: 'insensitive' } },
      { recipientEmail: { contains: params.query, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    db.notificationQueue.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        template: true,
        booking: {
          select: { lrNumber: true, status: true },
        },
      },
    }),
    db.notificationQueue.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getNotificationHistoryAction(queueId: string) {
  return await db.notificationHistory.findMany({
    where: { queueId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNotificationAuditAction(queueId: string) {
  return await db.notificationAudit.findMany({
    where: { queueId },
    orderBy: { timestamp: 'desc' },
  });
}

export async function triggerWorkerAction() {
  const result = await processQueue(`admin_manual_${Date.now()}`, 50);
  revalidatePath('/admin/notifications');
  return result;
}

export async function retryNotificationAction(queueId: string) {
  const item = await db.notificationQueue.findUnique({ where: { id: queueId } });
  if (!item) return { success: false, error: 'Notification not found' };

  await db.notificationQueue.update({
    where: { id: queueId },
    data: {
      status: NotificationStatus.PENDING,
      availableAt: new Date(),
      lockedUntil: null,
      workerId: null,
      failureReason: null,
    },
  });

  await createNotificationAudit(queueId, 'MANUAL_RETRY_INITIATED', null, item.status, NotificationStatus.PENDING);
  const result = await processQueue(`manual_retry_${Date.now()}`, 10);
  revalidatePath('/admin/notifications');
  return { success: true, result };
}

export async function cancelNotificationAction(queueId: string) {
  try {
    const updated = await cancelNotification(queueId);
    revalidatePath('/admin/notifications');
    return { success: true, item: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getNotificationTemplatesAction() {
  return await db.notificationTemplate.findMany({
    orderBy: [{ event: 'asc' }, { languageCode: 'asc' }, { version: 'desc' }],
  });
}

export async function createTemplateVersionAction(data: {
  name: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  languageCode?: string;
  title?: string;
  messageTemplate: string;
  variables?: string[];
  userId?: string;
}) {
  const lang = data.languageCode || 'en';

  // Find current max version for event+channel+lang
  const latest = await db.notificationTemplate.findFirst({
    where: {
      event: data.event,
      channel: data.channel,
      languageCode: lang,
    },
    orderBy: { version: 'desc' },
  });

  const nextVersion = latest ? latest.version + 1 : 1;

  // Deactivate previous active templates
  await db.notificationTemplate.updateMany({
    where: {
      event: data.event,
      channel: data.channel,
      languageCode: lang,
    },
    data: { isActive: false },
  });

  const created = await db.notificationTemplate.create({
    data: {
      name: data.name,
      event: data.event,
      channel: data.channel,
      languageCode: lang,
      version: nextVersion,
      title: data.title || null,
      messageTemplate: data.messageTemplate,
      variables: data.variables ? JSON.stringify(data.variables) : null,
      isActive: true,
      createdBy: data.userId || 'ADMIN',
    },
  });

  revalidatePath('/admin/notifications/templates');
  return { success: true, template: created };
}

export async function testTemplateRenderAction(data: {
  messageTemplate: string;
  variables: Record<string, string | number>;
  title?: string;
  event?: NotificationEvent;
}) {
  return renderTemplate(data);
}

export async function testNotificationAction(data: {
  event: NotificationEvent;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  channel: NotificationChannel;
  variables: Record<string, string | number>;
}) {
  const record = await enqueueNotification({
    event: data.event,
    recipientName: data.recipientName,
    recipientPhone: data.recipientPhone,
    recipientEmail: data.recipientEmail,
    channel: data.channel,
    variables: data.variables,
    priority: NotificationPriority.HIGH,
    deduplicationKey: `test_${Date.now()}_${Math.random()}`,
  });

  // Process immediately
  const workerResult = await processQueue(`test_run_${Date.now()}`, 10);
  revalidatePath('/admin/notifications');
  return { success: true, record, workerResult };
}

export async function createBroadcastAction(data: {
  title: string;
  message: string;
  targetRole?: Role | 'ALL';
  channel: NotificationChannel;
  userId?: string;
}) {
  const isSpecificRole = data.targetRole && data.targetRole !== ('ALL' as any);

  const users = await db.user.findMany({
    where: {
      ...(isSpecificRole ? { role: data.targetRole as Role } : {}),
      status: true,
    },
    select: { id: true, name: true, phone: true, email: true },
  });

  const broadcast = await db.broadcastNotification.create({
    data: {
      title: data.title,
      message: data.message,
      targetRole: isSpecificRole ? (data.targetRole as Role) : null,
      channel: data.channel,
      createdById: data.userId || null,
      recipientCount: users.length,
    },
  });

  // Enqueue queue records for each recipient
  for (const u of users) {
    await enqueueNotification({
      event: NotificationEvent.BROADCAST_ANNOUNCEMENT,
      recipientType: NotificationRecipientType.SENDER,
      recipientId: u.id,
      recipientName: u.name,
      recipientPhone: u.phone,
      recipientEmail: u.email,
      channel: data.channel,
      variables: {
        recipientName: u.name,
        announcementTitle: data.title,
        messageContent: data.message,
      },
      deduplicationKey: `broadcast_${broadcast.id}_${u.id}`,
    });
  }

  // Trigger worker to send batch
  processQueue(`broadcast_worker_${Date.now()}`, 100);

  revalidatePath('/admin/notifications');
  revalidatePath('/admin/notifications/broadcast');
  return { success: true, count: users.length, broadcastId: broadcast.id };
}

export async function updateCustomerNotificationPreferencesAction(data: {
  userId: string;
  allowSMS: boolean;
  allowEmail: boolean;
  allowMarketing: boolean;
  allowPush: boolean;
  preferredLanguage: string;
}) {
  const updated = await db.user.update({
    where: { id: data.userId },
    data: {
      allowSMS: data.allowSMS,
      allowEmail: data.allowEmail,
      allowMarketing: data.allowMarketing,
      allowPush: data.allowPush,
      preferredLanguage: data.preferredLanguage,
    },
  });

  revalidatePath('/customer/settings/notifications');
  return { success: true, user: updated };
}
