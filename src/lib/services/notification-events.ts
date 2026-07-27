import { NotificationEvent, NotificationPriority, NotificationRecipientType, NotificationChannel } from '@prisma/client';

export interface EventDefinition {
  event: NotificationEvent;
  title: string;
  defaultPriority: NotificationPriority;
  defaultRecipients: NotificationRecipientType[];
  defaultChannel: NotificationChannel;
  fallbackChannels: NotificationChannel[];
  requiredVariables: string[];
  description: string;
}

export const EVENT_REGISTRY: Record<NotificationEvent, EventDefinition> = {
  [NotificationEvent.BOOKING_CREATED]: {
    event: NotificationEvent.BOOKING_CREATED,
    title: 'Booking Created',
    defaultPriority: NotificationPriority.HIGH,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['senderName', 'receiverName', 'lrNumber', 'origin', 'destination', 'trackingUrl'],
    description: 'Triggered immediately when a parcel booking is registered.',
  },

  [NotificationEvent.BOOKING_CANCELLED]: {
    event: NotificationEvent.BOOKING_CANCELLED,
    title: 'Booking Cancelled',
    defaultPriority: NotificationPriority.HIGH,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['lrNumber', 'reason'],
    description: 'Triggered when a booking is cancelled.',
  },

  [NotificationEvent.PICKUP_REQUESTED]: {
    event: NotificationEvent.PICKUP_REQUESTED,
    title: 'Pickup Requested',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['senderName', 'lrNumber', 'pickupAddress'],
    description: 'Triggered when doorstep taxi pickup is requested.',
  },

  [NotificationEvent.PARCEL_RECEIVED]: {
    event: NotificationEvent.PARCEL_RECEIVED,
    title: 'Parcel Received at Origin',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['senderName', 'lrNumber', 'originOffice'],
    description: 'Triggered when parcel is received at origin branch.',
  },

  [NotificationEvent.PARCEL_SORTED]: {
    event: NotificationEvent.PARCEL_SORTED,
    title: 'Parcel Sorted',
    defaultPriority: NotificationPriority.LOW,
    defaultRecipients: [NotificationRecipientType.SENDER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['lrNumber', 'officeName'],
    description: 'Triggered when parcel sorting is completed.',
  },

  [NotificationEvent.PARCEL_LOADED]: {
    event: NotificationEvent.PARCEL_LOADED,
    title: 'Parcel Loaded',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['lrNumber', 'vehicleNumber', 'dispatchNumber'],
    description: 'Triggered when parcel is loaded onto vehicle.',
  },

  [NotificationEvent.DISPATCH_DEPARTED]: {
    event: NotificationEvent.DISPATCH_DEPARTED,
    title: 'Dispatch Departed',
    defaultPriority: NotificationPriority.HIGH,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['lrNumber', 'dispatchNumber', 'vehicleNumber', 'estimatedArrival'],
    description: 'Triggered when dispatch vehicle departs origin office.',
  },

  [NotificationEvent.IN_TRANSIT]: {
    event: NotificationEvent.IN_TRANSIT,
    title: 'Parcel In Transit',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['lrNumber', 'statusLocation', 'estimatedArrival'],
    description: 'Triggered on transit checkpoint updates.',
  },

  [NotificationEvent.ARRIVED_DESTINATION]: {
    event: NotificationEvent.ARRIVED_DESTINATION,
    title: 'Arrived at Destination Office',
    defaultPriority: NotificationPriority.HIGH,
    defaultRecipients: [NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['receiverName', 'lrNumber', 'destinationOffice', 'officeAddress', 'officeTiming'],
    description: 'Triggered when parcel arrives at destination branch office.',
  },

  [NotificationEvent.READY_FOR_COLLECTION]: {
    event: NotificationEvent.READY_FOR_COLLECTION,
    title: 'Ready for Collection',
    defaultPriority: NotificationPriority.CRITICAL,
    defaultRecipients: [NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['receiverName', 'lrNumber', 'collectionOffice', 'officeAddress', 'officePhone', 'helpline', 'trackingUrl'],
    description: 'Triggered when parcel is ready for collection by receiver.',
  },

  [NotificationEvent.COLLECTED]: {
    event: NotificationEvent.COLLECTED,
    title: 'Parcel Collected',
    defaultPriority: NotificationPriority.HIGH,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['receiverName', 'lrNumber', 'collectedTime', 'officeName'],
    description: 'Triggered when receiver collects the parcel.',
  },

  [NotificationEvent.COMPLETED]: {
    event: NotificationEvent.COMPLETED,
    title: 'Booking Completed',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['senderName', 'lrNumber'],
    description: 'Triggered when booking lifecycle is completed.',
  },

  [NotificationEvent.RETURN_REQUESTED]: {
    event: NotificationEvent.RETURN_REQUESTED,
    title: 'Return Requested',
    defaultPriority: NotificationPriority.HIGH,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['lrNumber', 'reason'],
    description: 'Triggered when a return to origin is initiated.',
  },

  [NotificationEvent.RETURN_COMPLETED]: {
    event: NotificationEvent.RETURN_COMPLETED,
    title: 'Return Completed',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS],
    requiredVariables: ['senderName', 'lrNumber', 'originOffice'],
    description: 'Triggered when parcel return to origin is finalized.',
  },

  [NotificationEvent.BROADCAST_ANNOUNCEMENT]: {
    event: NotificationEvent.BROADCAST_ANNOUNCEMENT,
    title: 'Broadcast Announcement',
    defaultPriority: NotificationPriority.NORMAL,
    defaultRecipients: [NotificationRecipientType.SENDER, NotificationRecipientType.RECEIVER, NotificationRecipientType.EMPLOYEE, NotificationRecipientType.PARTNER_OFFICE],
    defaultChannel: NotificationChannel.WHATSAPP,
    fallbackChannels: [NotificationChannel.SMS, NotificationChannel.EMAIL],
    requiredVariables: ['recipientName', 'announcementTitle', 'messageContent'],
    description: 'Triggered for system-wide announcements.',
  },
};
