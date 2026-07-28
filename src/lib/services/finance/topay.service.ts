import { db as prisma } from '@/lib/db';
import { addCashEntry } from './cashbook.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export async function collectToPay(bookingId: string, collectedBy: string, officeId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  // 1. Mark Booking Payment Status PAID
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: 'PAID' as any,
      collectedAt: new Date(),
      collectedBy
    }
  });

  // 2. Automatically record in CashBook
  await addCashEntry({
    officeId,
    transactionType: 'TO_PAY_COLLECTION',
    amount: booking.totalAmount,
    description: `To-Pay parcel collection for LR #${booking.lrNumber}`,
    bookingId,
    createdBy: collectedBy
  });

  // 3. Log ActivityLog
  await createActivityLog({
    userId: collectedBy,
    module: 'FINANCE',
    entity: 'Booking',
    entityId: bookingId,
    action: `Collected To-Pay amount ₹${booking.totalAmount} for LR #${booking.lrNumber}`
  }).catch(() => null);

  return updatedBooking;
}

export async function getPendingToPay(officeId?: string, query?: string) {
  const whereClause: any = {
    paymentType: 'TO_PAY' as any,
    paymentStatus: 'PENDING' as any,
    status: { notIn: ['CANCELLED' as any] }
  };

  if (officeId) {
    whereClause.destinationOfficeId = officeId;
  }

  if (query && query.trim() !== '') {
    const q = query.trim();
    whereClause.OR = [
      { lrNumber: { contains: q, mode: 'insensitive' } },
      { receiverName: { contains: q, mode: 'insensitive' } },
      { receiverPhone: { contains: q, mode: 'insensitive' } }
    ];
  }

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      originOffice: { select: { name: true, city: true } },
      destinationOffice: { select: { name: true, city: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}
