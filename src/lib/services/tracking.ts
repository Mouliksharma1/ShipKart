import { db } from "@/lib/db";
import {
  BookingStatus,
  DispatchStatus,
  DelayReason,
  HoldReason,
  TrackingRemarkType,
  NotificationEvent,
  NotificationRecipientType,
  Role,
} from "@prisma/client";
import { enqueueNotification } from "@/lib/services/notification";
import { validateStatusTransition, UpdateTrackingInput } from "@/lib/validations/tracking";
import { normalizeLRNumber } from "@/lib/utils/normalize-lr";

export type UpdateStatusParams = UpdateTrackingInput & {
  userId?: string;
  userRole?: Role;
};

/**
 * CALCULATE EXPECTED NEXT STEP SUMMARY & OFFICE ADVANCEMENT
 */
export function calculateNextStep(status: BookingStatus, originOfficeName: string, destOfficeName: string): {
  expectedNextStep: string;
  suggestedCurrentOfficeRole: "ORIGIN" | "DESTINATION" | "TRANSIT";
} {
  switch (status) {
    case BookingStatus.BOOKED:
      return { expectedNextStep: `Receive parcel at ${originOfficeName}`, suggestedCurrentOfficeRole: "ORIGIN" };
    case BookingStatus.PICKUP_REQUESTED:
      return { expectedNextStep: `Pickup parcel & bring to ${originOfficeName}`, suggestedCurrentOfficeRole: "ORIGIN" };
    case BookingStatus.RECEIVED_AT_ORIGIN:
    case BookingStatus.RECEIVED_AT_ORIGIN_OFFICE:
      return { expectedNextStep: `Sort & load parcel into bus for ${destOfficeName}`, suggestedCurrentOfficeRole: "ORIGIN" };
    case BookingStatus.SORTED:
      return { expectedNextStep: `Load into bus bound for ${destOfficeName}`, suggestedCurrentOfficeRole: "ORIGIN" };
    case BookingStatus.LOADED:
      return { expectedNextStep: `Bus departure & transit to ${destOfficeName}`, suggestedCurrentOfficeRole: "ORIGIN" };
    case BookingStatus.IN_TRANSIT:
      return { expectedNextStep: `Bus arrival at ${destOfficeName}`, suggestedCurrentOfficeRole: "TRANSIT" };
    case BookingStatus.ARRIVED_AT_DESTINATION:
    case BookingStatus.ARRIVED_AT_DESTINATION_OFFICE:
    case BookingStatus.UNLOADED:
      return { expectedNextStep: `Sort for counter collection at ${destOfficeName}`, suggestedCurrentOfficeRole: "DESTINATION" };
    case BookingStatus.READY_FOR_COLLECTION:
      return { expectedNextStep: `Receiver collection at ${destOfficeName}`, suggestedCurrentOfficeRole: "DESTINATION" };
    case BookingStatus.COLLECTED:
      return { expectedNextStep: "Parcel delivery completed", suggestedCurrentOfficeRole: "DESTINATION" };
    case BookingStatus.COMPLETED:
      return { expectedNextStep: "Archived & Completed", suggestedCurrentOfficeRole: "DESTINATION" };
    case BookingStatus.DELAYED:
      return { expectedNextStep: "Resume transit when delay is resolved", suggestedCurrentOfficeRole: "TRANSIT" };
    case BookingStatus.HOLD:
      return { expectedNextStep: "Resolve hold condition to resume dispatch", suggestedCurrentOfficeRole: "ORIGIN" };
    default:
      return { expectedNextStep: "Pending next logistics event", suggestedCurrentOfficeRole: "ORIGIN" };
  }
}

/**
 * CORE TRACKING ENGINE: UPDATE BOOKING STATUS & CREATE IMMUTABLE HISTORY
 */
export async function updateBookingStatus(params: UpdateStatusParams) {
  return await db.$transaction(
    async (tx) => {
    // 1. Normalize LR input so "1", "01", "001", "0001" all resolve the same booking
    const normalizedLR = normalizeLRNumber(params.lrNumber);
    const paddedLR = normalizedLR.padStart(4, "0");

    // Fetch existing booking with optimistic locking & office relations
    const booking = await tx.booking.findFirst({
      where: {
        OR: [
          { lrNumber: normalizedLR },
          { lrNumber: paddedLR },
          { lrNumber: params.lrNumber }, // also try exact input (covers old SK... LRs)
        ],
      },
      include: {
        originOffice: true,
        destinationOffice: true,
      },
    });

    if (!booking) {
      throw new Error(`Booking with LR Number ${params.lrNumber} was not found.`);
    }

    // Optimistic concurrency version check
    if (params.expectedVersion !== undefined && booking.version !== params.expectedVersion) {
      throw new Error(
        `Concurrency Conflict: Booking ${params.lrNumber} was modified by another staff member. Please refresh.`
      );
    }

    // 2. Validate state transition rules
    const transitionCheck = validateStatusTransition(booking.status, params.status, params.userRole);
    if (!transitionCheck.valid) {
      throw new Error(transitionCheck.message || "Invalid status transition.");
    }

    // 3. Determine office auto-advancement
    let currentOfficeId = booking.currentOfficeId || booking.originOfficeId;
    let nextOfficeId = booking.nextOfficeId || booking.destinationOfficeId;

    if (
      params.status === BookingStatus.ARRIVED_AT_DESTINATION ||
      params.status === BookingStatus.ARRIVED_AT_DESTINATION_OFFICE ||
      params.status === BookingStatus.READY_FOR_COLLECTION ||
      params.status === BookingStatus.COLLECTED
    ) {
      currentOfficeId = booking.destinationOfficeId;
      nextOfficeId = booking.destinationOfficeId;
    } else if (params.status === BookingStatus.RECEIVED_AT_ORIGIN || params.status === BookingStatus.RECEIVED_AT_ORIGIN_OFFICE) {
      currentOfficeId = booking.originOfficeId;
      nextOfficeId = booking.destinationOfficeId;
    }

    // 4. Update Booking record (atomic version increment)
    const now = new Date();
    const updatedBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: params.status,
        currentOfficeId,
        nextOfficeId,
        lastUpdatedAt: now,
        lastUpdatedBy: params.userId || null,
        delayReason: params.delayReason || null,
        holdReason: params.holdReason || null,
        collectedAt: params.status === BookingStatus.COLLECTED ? now : booking.collectedAt,
        actualArrival:
          params.status === BookingStatus.ARRIVED_AT_DESTINATION ||
          params.status === BookingStatus.ARRIVED_AT_DESTINATION_OFFICE
            ? now
            : booking.actualArrival,
        version: { increment: 1 },
      },
    });

    // 5. Create IMMUTABLE TrackingHistory record (INSERT ONLY)
    const publicRemarks =
      params.publicRemarks ||
      params.title ||
      `Parcel status updated to ${params.status.replace(/_/g, " ")}`;

    const trackingHistory = await tx.trackingHistory.create({
      data: {
        bookingId: booking.id,
        dispatchId: params.dispatchId || null,
        status: params.status,
        title: params.title || params.status.replace(/_/g, " "),
        publicRemarks,
        internalRemarks: params.internalRemarks || null,
        remarkType: params.remarkType || TrackingRemarkType.EMPLOYEE,
        receiverNameVerified: params.receiverNameVerified || null,
        receiverPhoneVerified: params.receiverPhoneVerified || null,
        officeId: params.officeId || currentOfficeId,
        userId: params.userId || null,
        notes: publicRemarks,
      },
    });

    // 6. Enqueue NotificationQueue record via Central Notification Engine
    try {
      let event: NotificationEvent = NotificationEvent.IN_TRANSIT;
      if (params.status === BookingStatus.READY_FOR_COLLECTION) event = NotificationEvent.READY_FOR_COLLECTION;
      else if (params.status === BookingStatus.COLLECTED) event = NotificationEvent.COLLECTED;
      else if (params.status === BookingStatus.COMPLETED) event = NotificationEvent.COMPLETED;
      else if (params.status === BookingStatus.ARRIVED_AT_DESTINATION || params.status === BookingStatus.ARRIVED_AT_DESTINATION_OFFICE) event = NotificationEvent.ARRIVED_DESTINATION;
      else if (params.status === BookingStatus.CANCELLED) event = NotificationEvent.BOOKING_CANCELLED;

      const collectionOffice = booking.destinationOffice?.name || "Destination Office";
      const officeAddress = booking.destinationOffice?.address || "Branch Office";

      const notifVars = {
        receiverName: booking.receiverName,
        senderName: booking.senderName,
        lrNumber: booking.lrNumber,
        collectionOffice,
        officeAddress,
        officeName: collectionOffice,
        collectedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        helpline: "6350603414",
        trackingUrl: `https://shipkart.app/track/${booking.lrNumber}`,
        status: params.status.replace(/_/g, " "),
      };

      // Enqueue Receiver alert for delivery/arrival events
      await enqueueNotification({
        event,
        bookingId: booking.id,
        lrNumber: booking.lrNumber,
        recipientType: NotificationRecipientType.RECEIVER,
        recipientName: booking.receiverName,
        recipientPhone: booking.receiverPhone,
        variables: notifVars,
        deduplicationKey: `tracking_${params.status}_receiver_${booking.id}_v${booking.version}`,
      });

      // Enqueue Sender alert for collected/completed events
      if (params.status === BookingStatus.COLLECTED || params.status === BookingStatus.COMPLETED) {
        await enqueueNotification({
          event,
          bookingId: booking.id,
          lrNumber: booking.lrNumber,
          recipientType: NotificationRecipientType.SENDER,
          recipientName: booking.senderName,
          recipientPhone: booking.senderPhone,
          variables: notifVars,
          deduplicationKey: `tracking_${params.status}_sender_${booking.id}_v${booking.version}`,
        });
      }
    } catch (notifErr) {
      console.error("Failed to enqueue tracking notification:", notifErr);
    }

    // 7. Write immutable ActivityLog entry for full audit trail
    await tx.activityLog.create({
      data: {
        userId: params.userId || null,
        action: `TRACKING_STATUS_CHANGE_${booking.lrNumber}_FROM_${booking.status}_TO_${params.status}`,
      },
    });

    return { booking: updatedBooking, trackingHistory };
  }, { maxWait: 10000, timeout: 20000 });
}

/**
 * GET TIMELINE (WITH PUBLIC MASKING FOR UNAUTHENTICATED USERS)
 */
export async function getBookingTimeline(lrNumber: string, isStaff = false) {
  // Normalize so "1", "01", "001", "0001" all resolve the same booking
  const normalized = normalizeLRNumber(lrNumber);
  const padded = normalized.padStart(4, "0");

  const booking = await db.booking.findFirst({
    where: {
      OR: [
        { id: lrNumber }, // Direct Booking UUID lookup
        { lrNumber: normalized },
        { lrNumber: padded },
        { lrNumber }, // also try exact input (covers legacy SK... LRs)
      ],
    },
    include: {
      originOffice: true,
      destinationOffice: true,
      currentOffice: true,
      nextOffice: true,
      items: true,
      trackingHistory: {
        include: {
          office: true,
          user: isStaff ? { select: { id: true, name: true, role: true } } : false,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!booking) return null;

  // Mask internal remarks & staff data if caller is not staff
  const sanitizedTimeline = booking.trackingHistory.map((step) => ({
    id: step.id,
    status: step.status,
    title: step.title || step.status.replace(/_/g, " "),
    publicRemarks: step.publicRemarks || step.notes,
    internalRemarks: isStaff ? step.internalRemarks : undefined,
    office: step.office ? { name: step.office.name, city: step.office.city } : null,
    createdAt: step.createdAt,
    receiverNameVerified: step.receiverNameVerified,
  }));

  const nextStepInfo = calculateNextStep(
    booking.status,
    booking.originOffice.name,
    booking.destinationOffice.name
  );

  return {
    booking: {
      id: booking.id,
      lrNumber: booking.lrNumber,
      status: booking.status,
      createdAt: booking.createdAt,
      lastUpdatedAt: booking.lastUpdatedAt || booking.updatedAt,
      originOffice: { name: booking.originOffice.name, city: booking.originOffice.city, phone: booking.originOffice.phone },
      destinationOffice: { name: booking.destinationOffice.name, city: booking.destinationOffice.city, phone: booking.destinationOffice.phone, openingTime: booking.destinationOffice.openingTime, closingTime: booking.destinationOffice.closingTime },
      currentOffice: booking.currentOffice ? { name: booking.currentOffice.name, city: booking.currentOffice.city } : { name: booking.originOffice.name, city: booking.originOffice.city },
      nextOffice: booking.nextOffice ? { name: booking.nextOffice.name, city: booking.nextOffice.city } : { name: booking.destinationOffice.name, city: booking.destinationOffice.city },
      estimatedArrival: booking.estimatedArrival,
      delayReason: booking.delayReason,
      holdReason: booking.holdReason,
      version: booking.version,
      items: booking.items.map(i => ({ parcelType: i.parcelType, quantity: i.quantity, weightKg: i.weightKg })),
      // Sensitive fields only if staff
      ...(isStaff
        ? {
            senderName: booking.senderName,
            senderPhone: booking.senderPhone,
            receiverName: booking.receiverName,
            receiverPhone: booking.receiverPhone,
            totalAmount: booking.totalAmount,
            paymentType: booking.paymentType,
            paymentStatus: booking.paymentStatus,
          }
        : {}),
    },
    timeline: sanitizedTimeline,
    expectedNextStep: nextStepInfo.expectedNextStep,
  };
}
