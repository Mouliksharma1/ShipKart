import { db } from '@/lib/db';

export async function generateNotificationNumber(): Promise<string> {
  const result = await db.$transaction(async (tx) => {
    const seq = await tx.notificationSequence.upsert({
      where: { id: 1 },
      update: { lastNumber: { increment: 1 } },
      create: { id: 1, lastNumber: 1 },
    });

    const numStr = seq.lastNumber.toString().padStart(9, '0');
    return `NTF${numStr}`;
  });

  return result;
}
