import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NotificationStatus } from '@prisma/client';
import { createNotificationAudit } from '@/lib/services/notification';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { providerMessageId, status, error, provider } = body;

    if (!providerMessageId) {
      return NextResponse.json({ error: 'Missing providerMessageId' }, { status: 400 });
    }

    const queueRecord = await db.notificationQueue.findFirst({
      where: { providerMessageId },
    });

    if (!queueRecord) {
      return NextResponse.json({ error: 'Notification record not found' }, { status: 404 });
    }

    let newStatus: NotificationStatus = queueRecord.status;
    if (status === 'DELIVERED' || status === 'READ' || status === 'SENT') {
      newStatus = NotificationStatus.SENT;
    } else if (status === 'FAILED' || status === 'UNDELIVERABLE') {
      newStatus = NotificationStatus.FAILED;
    }

    await db.notificationHistory.create({
      data: {
        queueId: queueRecord.id,
        status: newStatus,
        channel: queueRecord.channel,
        provider: provider || queueRecord.provider || 'WEBHOOK',
        providerResponse: JSON.stringify(body),
      },
    });

    await db.notificationQueue.update({
      where: { id: queueRecord.id },
      data: {
        status: newStatus,
        failureReason: error || queueRecord.failureReason,
      },
    });

    await createNotificationAudit(queueRecord.id, `WEBHOOK_${status}`, null, queueRecord.status, newStatus);

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook internal error' }, { status: 500 });
  }
}
