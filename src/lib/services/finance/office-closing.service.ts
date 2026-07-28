import { db as prisma } from '@/lib/db';
import { getCashSummary, addCashEntry } from './cashbook.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export async function closeOffice(officeId: string, closedBy: string, remarks?: string) {
  const summary = await getCashSummary(officeId);

  const closing = await prisma.officeClosing.create({
    data: {
      officeId,
      openingCash: summary.openingCash,
      bookingCash: summary.bookingCash,
      toPayCollected: summary.toPayCollected,
      expenses: summary.expenses,
      closingCash: summary.currentBalance,
      closedBy,
      remarks
    }
  });

  // Record closing balance entry in CashBook
  await addCashEntry({
    officeId,
    transactionType: 'CLOSING_BALANCE',
    amount: summary.currentBalance,
    description: `Daily office closing balance locked by ${closedBy}. ${remarks || ''}`,
    createdBy: closedBy
  });

  await createActivityLog({
    userId: closedBy,
    module: 'FINANCE',
    entity: 'OfficeClosing',
    entityId: closing.id,
    action: `Closed office day with final cash balance of ₹${summary.currentBalance}`
  }).catch(() => null);

  return closing;
}

export async function getTodayClosing(officeId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const whereClause: any = { closedAt: { gte: startOfDay } };
  if (officeId) whereClause.officeId = officeId;

  return prisma.officeClosing.findFirst({
    where: whereClause,
    include: { office: { select: { name: true, city: true } } },
    orderBy: { closedAt: 'desc' }
  });
}
