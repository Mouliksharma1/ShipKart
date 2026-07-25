import { z } from "zod";

/**
 * VALID STATE TRANSITION MAP
 * Enforces legal state machine progression for ShipKart parcel lifecycle.
 * Flexible operational workflow allows staff direct updates while preventing invalid regressions.
 */
export const LEGAL_STATUS_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["BOOKED", "CANCELLED"],
  BOOKED: [
    "PICKUP_REQUESTED",
    "RECEIVED_AT_ORIGIN",
    "RECEIVED_AT_ORIGIN_OFFICE",
    "SORTED",
    "LOADED",
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "ARRIVED_AT_DESTINATION_OFFICE",
    "UNLOADED",
    "READY_FOR_COLLECTION",
    "CANCELLED",
    "HOLD",
  ],
  PICKUP_REQUESTED: [
    "RECEIVED_AT_ORIGIN",
    "RECEIVED_AT_ORIGIN_OFFICE",
    "SORTED",
    "LOADED",
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "CANCELLED",
    "HOLD",
  ],
  RECEIVED_AT_ORIGIN: [
    "SORTED",
    "LOADED",
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "READY_FOR_COLLECTION",
    "CANCELLED",
    "HOLD",
  ],
  RECEIVED_AT_ORIGIN_OFFICE: [
    "SORTED",
    "LOADED",
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "READY_FOR_COLLECTION",
    "CANCELLED",
    "HOLD",
  ],
  SORTED: [
    "LOADED",
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "READY_FOR_COLLECTION",
    "HOLD",
    "CANCELLED",
  ],
  LOADED: [
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "READY_FOR_COLLECTION",
    "DELAYED",
    "HOLD",
    "CANCELLED",
  ],
  IN_TRANSIT: [
    "ARRIVED_AT_DESTINATION",
    "ARRIVED_AT_DESTINATION_OFFICE",
    "UNLOADED",
    "READY_FOR_COLLECTION",
    "DELAYED",
    "HOLD",
    "RETURN_REQUESTED",
  ],
  ARRIVED_AT_DESTINATION: [
    "UNLOADED",
    "READY_FOR_COLLECTION",
    "COLLECTED",
    "HOLD",
  ],
  ARRIVED_AT_DESTINATION_OFFICE: [
    "UNLOADED",
    "READY_FOR_COLLECTION",
    "COLLECTED",
    "HOLD",
  ],
  UNLOADED: [
    "READY_FOR_COLLECTION",
    "COLLECTED",
    "HOLD",
  ],
  READY_FOR_COLLECTION: [
    "COLLECTED",
    "COMPLETED",
    "HOLD",
    "RETURN_REQUESTED",
  ],
  COLLECTED: [
    "COMPLETED",
  ],
  COMPLETED: [],
  CANCELLED: [],
  DELAYED: [
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "READY_FOR_COLLECTION",
    "HOLD",
    "CANCELLED",
  ],
  HOLD: [
    "RECEIVED_AT_ORIGIN",
    "LOADED",
    "IN_TRANSIT",
    "ARRIVED_AT_DESTINATION",
    "READY_FOR_COLLECTION",
    "CANCELLED",
    "RETURN_REQUESTED",
  ],
  RETURN_REQUESTED: [
    "RETURN_IN_TRANSIT",
    "CANCELLED",
  ],
  RETURN_IN_TRANSIT: [
    "RETURNED_TO_ORIGIN",
  ],
  RETURNED_TO_ORIGIN: [
    "COMPLETED",
  ],
};

/**
 * Check whether a status transition is allowed given current status and user role.
 */
export function validateStatusTransition(
  currentStatus: string,
  targetStatus: string,
  userRole?: string
): { valid: boolean; message?: string } {
  if (currentStatus === targetStatus) {
    return { valid: true };
  }

  // Admin override allows all transitions
  if (userRole === "ADMIN") {
    return { valid: true };
  }

  const allowedNext = LEGAL_STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(targetStatus)) {
    return {
      valid: false,
      message: `Illegal status transition from ${currentStatus} to ${targetStatus}.`,
    };
  }

  return { valid: true };
}

export const BOOKING_STATUS_VALUES = [
  "DRAFT",
  "BOOKED",
  "PICKUP_REQUESTED",
  "RECEIVED_AT_ORIGIN",
  "RECEIVED_AT_ORIGIN_OFFICE",
  "SORTED",
  "LOADED",
  "IN_TRANSIT",
  "ARRIVED_AT_DESTINATION",
  "ARRIVED_AT_DESTINATION_OFFICE",
  "UNLOADED",
  "READY_FOR_COLLECTION",
  "COLLECTED",
  "COMPLETED",
  "CANCELLED",
  "DELAYED",
  "HOLD",
  "RETURN_REQUESTED",
  "RETURN_IN_TRANSIT",
  "RETURNED_TO_ORIGIN",
] as const;

export const REMARK_TYPE_VALUES = [
  "SYSTEM",
  "EMPLOYEE",
  "PARTNER",
  "CUSTOMER_SERVICE",
] as const;

export const DELAY_REASON_VALUES = [
  "TRAFFIC",
  "VEHICLE_BREAKDOWN",
  "WEATHER",
  "ROAD_BLOCK",
  "STRIKE",
  "OTHER",
] as const;

export const HOLD_REASON_VALUES = [
  "DOCUMENT_PENDING",
  "PAYMENT_PENDING",
  "CUSTOMER_REQUEST",
  "DAMAGED_PARCEL",
  "OTHER",
] as const;

// Zod Input Schema for updating tracking status
export const UpdateTrackingSchema = z.object({
  lrNumber: z.string().min(1, "LR Number is required"),
  status: z.enum(BOOKING_STATUS_VALUES),
  title: z.string().optional(),
  publicRemarks: z.string().optional(),
  internalRemarks: z.string().optional(),
  remarkType: z.enum(REMARK_TYPE_VALUES).default("EMPLOYEE"),
  officeId: z.string().optional(),
  dispatchId: z.string().optional(),
  delayReason: z.enum(DELAY_REASON_VALUES).optional(),
  holdReason: z.enum(HOLD_REASON_VALUES).optional(),
  receiverNameVerified: z.string().optional(),
  receiverPhoneVerified: z.string().optional(),
  expectedVersion: z.number().int().optional(),
});

export type UpdateTrackingInput = z.infer<typeof UpdateTrackingSchema>;

// Zod Input Schema for creating a Dispatch Manifest
export const CreateDispatchSchema = z.object({
  vehicleNumber: z.string().min(2, "Vehicle number is required"),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  routeId: z.string().optional(),
  originOfficeId: z.string().min(1, "Origin office is required"),
  destinationOfficeId: z.string().min(1, "Destination office is required"),
  departureTime: z.string().optional(),
  estimatedArrival: z.string().optional(),
  bookingIds: z.array(z.string()).min(1, "Select at least one booking LR for dispatch"),
});

export type CreateDispatchInput = z.infer<typeof CreateDispatchSchema>;
