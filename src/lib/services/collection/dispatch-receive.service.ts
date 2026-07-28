import { db as prisma } from '@/lib/db';
import { BookingStatus, DispatchStatus } from '@prisma/client';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export async function receiveDispatch(dispatchId: string, userId?: string) {
  const dispatch = await prisma.dispatch.findUnique({
    where: { id: dispatchId },
    include: { bookings: true }
  });

  if (!dispatch) {
    throw new Error('Dispatch manifest not found');
  }

  // 1. Update Dispatch Status to ARRIVED
  const updatedDispatch = await prisma.dispatch.update({
    where: { id: dispatchId },
    data: {
      status: 'ARRIVED' as DispatchStatus,
      actualArrival: new Date()
    }
  });

  // 2. Update Associated Bookings to ARRIVED_AT_DESTINATION_OFFICE
  const bookingIds = dispatch.bookings.map(b => b.id);
  if (bookingIds.length > 0) {
    await prisma.booking.updateMany({
      where: { id: { in: bookingIds } },
      data: {
        status: 'ARRIVED_AT_DESTINATION_OFFICE' as BookingStatus,
        arrivedAtOfficeAt: new Date()
      }
    });

    // Create TrackingHistory entries
    for (const bId of bookingIds) {
      await prisma.trackingHistory.create({
        data: {
          bookingId: bId,
          dispatchId: dispatch.id,
          status: 'ARRIVED_AT_DESTINATION_OFFICE' as BookingStatus,
          title: 'Arrived at Destination Office',
          publicRemarks: `Cargo dispatch ${dispatch.dispatchNumber} arrived at destination branch office.`,
          internalRemarks: `Received by user ${userId || 'System'}`,
          userId
        }
      }).catch(() => null);
    }
  }

  if (userId) {
    await createActivityLog({
      userId,
      module: 'COLLECTION',
      entity: 'Dispatch',
      entityId: dispatchId,
      action: `Receive dispatch manifest ${dispatch.dispatchNumber} with ${bookingIds.length} parcels.`
    }).catch(() => null);
  }


  return updatedDispatch;
}

export async function unloadParcel(bookingId: string, userId?: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    throw new Error('Parcel booking not found');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: 'READY_FOR_COLLECTION' as BookingStatus,
      collectionStatus: 'READY' as any
    }
  });

  await prisma.trackingHistory.create({
    data: {
      bookingId,
      status: 'READY_FOR_COLLECTION' as BookingStatus,
      title: 'Parcel Ready for Pickup / Collection',
      publicRemarks: `Parcel LR #${booking.lrNumber} has been unloaded and is ready for customer collection.`,
      internalRemarks: `Unloaded by user ${userId || 'System'}`,
      userId
    }
  }).catch(() => null);

  if (userId) {
    await createActivityLog({
      userId,
      module: 'COLLECTION',
      entity: 'Booking',
      entityId: bookingId,
      action: `Unloaded parcel LR #${booking.lrNumber} and marked Ready For Collection.`
    }).catch(() => null);
  }


  return updatedBooking;
}
