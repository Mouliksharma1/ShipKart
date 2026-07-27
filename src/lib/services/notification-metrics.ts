import { db } from '@/lib/db';
import { NotificationStatus, NotificationChannel } from '@prisma/client';

export async function getNotificationMetrics() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalPending,
    sentToday,
    failedToday,
    deadLetterCount,
    queueLength,
    channelStatsRaw,
    recentAudit,
  ] = await Promise.all([
    db.notificationQueue.count({ where: { status: NotificationStatus.PENDING } }),
    db.notificationQueue.count({
      where: {
        status: NotificationStatus.SENT,
        processedAt: { gte: startOfDay },
      },
    }),
    db.notificationQueue.count({
      where: {
        status: NotificationStatus.FAILED,
        updatedAt: { gte: startOfDay },
      },
    }),
    db.notificationQueue.count({ where: { status: NotificationStatus.DEAD_LETTER } }),
    db.notificationQueue.count({
      where: { status: { in: [NotificationStatus.PENDING, NotificationStatus.PROCESSING, NotificationStatus.FAILED] } },
    }),
    db.notificationQueue.groupBy({
      by: ['channel', 'status'],
      _count: true,
    }),
    db.notificationAudit.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        queue: {
          select: { queueNumber: true, recipientName: true, channel: true, event: true },
        },
      },
    }),
  ]);

  // Aggregate channel statistics
  const channelDistribution: Record<NotificationChannel, { sent: number; failed: number; pending: number }> = {
    WHATSAPP: { sent: 0, failed: 0, pending: 0 },
    SMS: { sent: 0, failed: 0, pending: 0 },
    EMAIL: { sent: 0, failed: 0, pending: 0 },
    PUSH: { sent: 0, failed: 0, pending: 0 },
  };

  for (const row of channelStatsRaw) {
    if (!channelDistribution[row.channel]) continue;
    if (row.status === NotificationStatus.SENT) channelDistribution[row.channel].sent += row._count;
    else if (row.status === NotificationStatus.FAILED || row.status === NotificationStatus.DEAD_LETTER) channelDistribution[row.channel].failed += row._count;
    else if (row.status === NotificationStatus.PENDING || row.status === NotificationStatus.PROCESSING) channelDistribution[row.channel].pending += row._count;
  }

  const totalProcessed = sentToday + failedToday;
  const successRate = totalProcessed > 0 ? Math.round((sentToday / totalProcessed) * 100) : 100;

  return {
    totalPending,
    sentToday,
    failedToday,
    deadLetterCount,
    queueLength,
    successRate,
    channelDistribution,
    recentAudit,
  };
}
