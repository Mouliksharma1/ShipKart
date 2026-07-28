import { db as prisma } from '@/lib/db';
import { BookingStatus } from '@prisma/client';
import { verifyOTP } from './otp.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export async function getPendingCollections(officeId?: string, query?: string) {
  const whereClause: any = {
    status: { in: ['ARRIVED_AT_DESTINATION_OFFICE', 'READY_FOR_COLLECTION'] as any[] }
  };

  if (officeId) {
    whereClause.destinationOfficeId = officeId;
  }

  if (query && query.trim() !== '') {
    const q = query.trim();
    whereClause.OR = [
      { lrNumber: { contains: q, mode: 'insensitive' } },
      { receiverName: { contains: q, mode: 'insensitive' } },
      { receiverPhone: { contains: q, mode: 'insensitive' } },
      { senderName: { contains: q, mode: 'insensitive' } }
    ];
  }

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      originOffice: { select: { name: true, city: true } },
      destinationOffice: { select: { name: true, city: true } },
      items: true,
      collectionOtp: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getCollectedToday(officeId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const whereClause: any = {
    status: { in: ['COLLECTED', 'COMPLETED'] as any[] },
    collectedAt: { gte: startOfDay }
  };

  if (officeId) {
    whereClause.destinationOfficeId = officeId;
  }

  return prisma.booking.findMany({
    where: whereClause,
    include: {
      originOffice: { select: { name: true, city: true } },
      destinationOffice: { select: { name: true, city: true } },
      items: true
    },
    orderBy: { collectedAt: 'desc' }
  });
}

export async function collectParcel(bookingId: string, otpCode: string, collectedByName: string, userId?: string) {
  // 1. Verify OTP first
  await verifyOTP(bookingId, otpCode);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new Error('Parcel booking not found');
  }

  // 2. Mark Booking COLLECTED and COMPLETED
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'COMPLETED' as BookingStatus,
      collectionStatus: 'COLLECTED' as any,
      collectedAt: new Date(),
      collectedBy: collectedByName,
      paymentStatus: 'PAID' as any
    }
  });

  // 3. Log TrackingHistory
  await prisma.trackingHistory.create({
    data: {
      bookingId,
      status: 'COMPLETED' as BookingStatus,
      title: 'Parcel Handed Over & Collected',
      publicRemarks: `Parcel LR #${booking.lrNumber} handed over to receiver ${collectedByName}. Collection verified via OTP.`,
      internalRemarks: `Handover processed by staff ${userId || 'System'}`,
      userId
    }
  }).catch(() => null);

  if (userId) {
    await createActivityLog({
      userId,
      module: 'COLLECTION',
      entity: 'Booking',
      entityId: bookingId,
      action: `Handed over parcel LR #${booking.lrNumber} to ${collectedByName} with verified OTP.`
    }).catch(() => null);
  }


  return updatedBooking;
}
