import { db as prisma } from '@/lib/db';
import { CashTransactionType } from '@prisma/client';

export interface AddCashEntryInput {
  officeId: string;
  transactionType: CashTransactionType;
  amount: number;
  description?: string;
  bookingId?: string;
  createdBy: string;
}

export async function addCashEntry(input: AddCashEntryInput) {
  return prisma.cashBook.create({
    data: {
      officeId: input.officeId,
      transactionType: input.transactionType,
      amount: input.amount,
      description: input.description,
      bookingId: input.bookingId,
      createdBy: input.createdBy
    }
  });
}

export async function getTodayCashBook(officeId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const whereClause: any = {
    createdAt: { gte: startOfDay }
  };

  if (officeId) {
    whereClause.officeId = officeId;
  }

  return prisma.cashBook.findMany({
    where: whereClause,
    include: {
      booking: { select: { lrNumber: true, senderName: true, receiverName: true } },
      office: { select: { name: true, city: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCashSummary(officeId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const whereClause: any = { createdAt: { gte: startOfDay } };
  if (officeId) whereClause.officeId = officeId;

  const entries = await prisma.cashBook.findMany({
    where: whereClause
  });

  let openingCash = 0;
  let bookingCash = 0;
  let toPayCollected = 0;
  let expenses = 0;

  for (const entry of entries) {
    if (entry.transactionType === 'OPENING_BALANCE') openingCash += entry.amount;
    else if (entry.transactionType === 'BOOKING_PAYMENT') bookingCash += entry.amount;
    else if (entry.transactionType === 'TO_PAY_COLLECTION') toPayCollected += entry.amount;
    else if (entry.transactionType === 'EXPENSE') expenses += entry.amount;
  }

  const currentBalance = (openingCash + bookingCash + toPayCollected) - expenses;

  return {
    openingCash,
    bookingCash,
    toPayCollected,
    expenses,
    currentBalance
  };
}
