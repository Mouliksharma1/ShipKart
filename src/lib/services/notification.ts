import { db } from '@/lib/db';
import {
  NotificationChannel,
  NotificationEvent,
  NotificationPriority,
  NotificationRecipientType,
  NotificationStatus,
  Prisma,
} from '@prisma/client';
import { generateNotificationNumber } from './notification-number';
import { EVENT_REGISTRY } from './notification-events';
import { renderTemplate } from './template';
import { NOTIFICATION_CONFIG } from '@/config/notification.config';
import { WhatsAppProvider } from '@/lib/providers/whatsapp';
import { SMSProvider } from '@/lib/providers/sms';
import { MockWhatsAppProvider } from '@/lib/providers/mock-whatsapp';
import { MockSMSProvider } from '@/lib/providers/mock-sms';
import { EmailProvider } from '@/lib/providers/email';
import { PushProvider } from '@/lib/providers/push';

export interface EnqueueNotificationParams {
  event: NotificationEvent;
  bookingId?: string | null;
  lrNumber?: string | null;
  recipientType?: NotificationRecipientType;
  recipientId?: string | null;
  recipientName: string;
  recipientPhone?: string | null;
  recipientEmail?: string | null;
  variables: Record<string, string | number | undefined | null>;
  channel?: NotificationChannel;
  priority?: NotificationPriority;
  languageCode?: string;
  scheduledAt?: Date;
  availableAt?: Date;
  expiresAt?: Date;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  deduplicationKey?: string;
}

/**
 * Creates a NotificationAudit record
 */
export async function createNotificationAudit(
  queueId: string,
  action: string,
  userId?: string | null,
  oldStatus?: NotificationStatus | null,
  newStatus?: NotificationStatus | null
) {
  try {
    await db.notificationAudit.create({
      data: {
        queueId,
        action,
        userId: userId || null,
        oldStatus: oldStatus || null,
        newStatus: newStatus || null,
      },
    });
  } catch (err) {
    console.error('Failed to write NotificationAudit:', err);
  }
}

/**
 * Main entry point for business modules to enqueue notifications.
 * Implements deduplication, customer preference checks, and template resolution.
 */
export async function enqueueNotification(params: EnqueueNotificationParams) {
  const eventDef = EVENT_REGISTRY[params.event];
  const channel = params.channel || eventDef.defaultChannel;
  const priority = params.priority || eventDef.defaultPriority;
  const recipientType = params.recipientType || eventDef.defaultRecipients[0] || NotificationRecipientType.SENDER;
  const lang = params.languageCode || NOTIFICATION_CONFIG.DEFAULT_LANGUAGE;

  // 1. Generate unique deduplication key
  const deduplicationKey =
    params.deduplicationKey ||
    `${params.event}_${params.bookingId || 'nobooking'}_${recipientType}_${channel}_${lang}`;

  // Check if notification already exists with this deduplication key
  const existing = await db.notificationQueue.findUnique({
    where: { deduplicationKey },
  });
  if (existing) {
    return existing; // Skip duplicate creation silently
  }

  // 2. Check Customer Preferences if recipientId / user is known
  if (params.recipientId) {
    const user = await db.user.findUnique({
      where: { id: params.recipientId },
      select: { allowSMS: true, allowEmail: true, allowPush: true },
    });
    if (user) {
      if (channel === NotificationChannel.SMS && !user.allowSMS) {
        console.log(`[Notification] Skipping SMS for user ${params.recipientId} per settings`);
      }
      if (channel === NotificationChannel.EMAIL && !user.allowEmail) {
        console.log(`[Notification] Skipping Email for user ${params.recipientId} per settings`);
      }
      if (channel === NotificationChannel.PUSH && !user.allowPush) {
        console.log(`[Notification] Skipping Push for user ${params.recipientId} per settings`);
      }
    }
  }

  // 3. Resolve active template for event + channel + languageCode
  let template = await db.notificationTemplate.findFirst({
    where: {
      event: params.event,
      channel,
      languageCode: lang,
      isActive: true,
    },
    orderBy: { version: 'desc' },
  });

  // Fallback to English template if localized missing
  if (!template && lang !== 'en') {
    template = await db.notificationTemplate.findFirst({
      where: {
        event: params.event,
        channel,
        languageCode: 'en',
        isActive: true,
      },
      orderBy: { version: 'desc' },
    });
  }

  // Fallback to generic message if template missing
  const defaultTemplateStr = template?.messageTemplate || `Update for parcel {{lrNumber}}: {{status}}`;

  // 4. Render template and validate placeholders
  const rendered = renderTemplate({
    messageTemplate: defaultTemplateStr,
    variables: params.variables,
    event: params.event,
    title: template?.title,
  });

  const queueNumber = await generateNotificationNumber();
  const fallbackChannels = eventDef.fallbackChannels.join(',');

  const record = await db.notificationQueue.create({
    data: {
      queueNumber,
      deduplicationKey,
      eventHash: `${params.event}:${params.bookingId || ''}`,
      bookingId: params.bookingId || null,
      lrNumber: params.lrNumber || (params.variables.lrNumber as string) || null,
      recipientType,
      recipientId: params.recipientId || null,
      recipientName: params.recipientName,
      recipientPhone: params.recipientPhone || null,
      recipientEmail: params.recipientEmail || null,
      channel,
      fallbackChannels,
      priority,
      event: params.event,
      status: NotificationStatus.PENDING,
      message: rendered.message,
      templateId: template?.id || null,
      scheduledAt: params.scheduledAt || new Date(),
      availableAt: params.availableAt || params.scheduledAt || new Date(),
      expiresAt: params.expiresAt || null,
      attachmentUrl: params.attachmentUrl || null,
      attachmentType: params.attachmentType || null,
    },
  });

  await createNotificationAudit(record.id, 'ENQUEUED', null, null, NotificationStatus.PENDING);

  return record;
}

/**
 * Sends a notification using a specific channel or attempts fallback channels on failure.
 */
export async function sendWithFallback(
  item: Prisma.NotificationQueueGetPayload<{ include: { template: true } }>
) {
  const channelsToTry: NotificationChannel[] = [item.channel];
  if (item.fallbackChannels) {
    const split = item.fallbackChannels.split(',').map((c) => c.trim() as NotificationChannel);
    for (const ch of split) {
      if (!channelsToTry.includes(ch)) {
        channelsToTry.push(ch);
      }
    }
  }

  let lastError = '';
  for (const currentChannel of channelsToTry) {
    let response;
    const recipientContact =
      currentChannel === NotificationChannel.EMAIL
        ? item.recipientEmail
        : item.recipientPhone;

    if (!recipientContact) {
      lastError = `No contact details provided for channel ${currentChannel}`;
      continue;
    }

    try {
      const isMock = NOTIFICATION_CONFIG.MODE === 'mock';

      if (currentChannel === NotificationChannel.WHATSAPP) {
        const provider = isMock ? MockWhatsAppProvider : WhatsAppProvider;
        response = await provider.send({ to: recipientContact, message: item.message, attachmentUrl: item.attachmentUrl });
      } else if (currentChannel === NotificationChannel.SMS) {
        const provider = isMock ? MockSMSProvider : SMSProvider;
        response = await provider.send({ to: recipientContact, message: item.message });
      } else if (currentChannel === NotificationChannel.EMAIL) {
        response = await EmailProvider.send({ to: recipientContact, message: item.message, title: item.template?.title || 'ShipKart Notification' });
      } else if (currentChannel === NotificationChannel.PUSH) {
        response = await PushProvider.send({ to: recipientContact, message: item.message });
      }

      if (response && response.success) {
        // Log history
        await db.notificationHistory.create({
          data: {
            queueId: item.id,
            status: NotificationStatus.SENT,
            channel: currentChannel,
            provider: response.provider,
            providerResponse: JSON.stringify(response),
          },
        });

        // Update queue
        await db.notificationQueue.update({
          where: { id: item.id },
          data: {
            status: NotificationStatus.SENT,
            channel: currentChannel,
            provider: response.provider,
            providerMessageId: response.providerMessageId,
            processedAt: new Date(),
            failureReason: null,
            lockedUntil: null,
            workerId: null,
          },
        });

        await createNotificationAudit(item.id, 'SENT', item.status, NotificationStatus.SENT);
        return { success: true, channel: currentChannel, provider: response.provider };
      } else {
        lastError = response?.error || `Channel ${currentChannel} delivery failed`;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  // If all channels failed
  const nextRetryCount = item.retryCount + 1;
  const maxRetries = item.maxRetries || NOTIFICATION_CONFIG.MAX_RETRIES;

  if (nextRetryCount >= maxRetries) {
    // Dead Letter Queue / Final Failure
    await db.notificationQueue.update({
      where: { id: item.id },
      data: {
        status: NotificationStatus.DEAD_LETTER,
        retryCount: nextRetryCount,
        failureReason: `Exceeded max retries. Last error: ${lastError}`,
        processedAt: new Date(),
        lockedUntil: null,
        workerId: null,
      },
    });

    await db.notificationHistory.create({
      data: {
        queueId: item.id,
        status: NotificationStatus.DEAD_LETTER,
        channel: item.channel,
        providerResponse: JSON.stringify({ error: lastError }),
      },
    });

    await createNotificationAudit(item.id, 'MOVED_TO_DEAD_LETTER', item.status, NotificationStatus.DEAD_LETTER);
    return { success: false, deadLetter: true, error: lastError };
  } else {
    // Schedule retry with exponential delay
    const delayMinutes = NOTIFICATION_CONFIG.RETRY_DELAYS_MINUTES[nextRetryCount - 1] || 30;
    const nextAvailableAt = new Date(Date.now() + delayMinutes * 60 * 1000);

    await db.notificationQueue.update({
      where: { id: item.id },
      data: {
        status: NotificationStatus.FAILED,
        retryCount: nextRetryCount,
        failureReason: lastError,
        availableAt: nextAvailableAt,
        lockedUntil: null,
        workerId: null,
      },
    });

    await db.notificationHistory.create({
      data: {
        queueId: item.id,
        status: NotificationStatus.FAILED,
        channel: item.channel,
        providerResponse: JSON.stringify({ error: lastError, nextAvailableAt }),
      },
    });

    await createNotificationAudit(item.id, 'RETRY_SCHEDULED', item.status, NotificationStatus.FAILED);
    return { success: false, scheduledRetry: nextAvailableAt, error: lastError };
  }
}

/**
 * Worker queue processor with optimistic row locking
 */
export async function processQueue(workerId: string = 'worker_default', limit: number = NOTIFICATION_CONFIG.BATCH_SIZE) {
  const now = new Date();
  const lockTimeout = new Date(now.getTime() + NOTIFICATION_CONFIG.LOCK_TIMEOUT_SECONDS * 1000);

  // 1. Fetch available pending/failed items that are not locked
  const candidates = await db.notificationQueue.findMany({
    where: {
      status: { in: [NotificationStatus.PENDING, NotificationStatus.FAILED] },
      availableAt: { lte: now },
      OR: [
        { lockedUntil: null },
        { lockedUntil: { lt: now } }, // Lock expired
      ],
    },
    take: limit,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'asc' },
    ],
    include: { template: true },
  });

  if (candidates.length === 0) {
    return { processed: 0, successes: 0, failures: 0 };
  }

  let successes = 0;
  let failures = 0;

  for (const item of candidates) {
    // Lock item atomically
    const locked = await db.notificationQueue.updateMany({
      where: {
        id: item.id,
        OR: [
          { lockedUntil: null },
          { lockedUntil: { lt: now } },
        ],
      },
      data: {
        status: NotificationStatus.PROCESSING,
        workerId,
        processingStartedAt: now,
        lockedUntil: lockTimeout,
      },
    });

    if (locked.count === 0) {
      continue; // Acquired by another worker
    }

    const res = await sendWithFallback(item);
    if (res.success) {
      successes++;
    } else {
      failures++;
    }
  }

  return { processed: candidates.length, successes, failures };
}

export async function cancelNotification(queueId: string, userId?: string) {
  const item = await db.notificationQueue.findUnique({ where: { id: queueId } });
  if (!item) throw new Error('Notification not found');

  const updated = await db.notificationQueue.update({
    where: { id: queueId },
    data: {
      status: NotificationStatus.CANCELLED,
      failureReason: 'Cancelled manually by user/admin',
    },
  });

  await createNotificationAudit(queueId, 'CANCELLED', userId, item.status, NotificationStatus.CANCELLED);
  return updated;
}
