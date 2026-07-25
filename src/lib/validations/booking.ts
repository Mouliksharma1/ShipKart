import { z } from "zod";

export const PARCEL_TYPE_VALUES = ["ENVELOPE", "BOX", "MEDIUM_PARCEL", "LARGE_BUNDLE"] as const;
export const PICKUP_METHOD_VALUES = ["SELF_DROP", "TAXI_PICKUP"] as const;
export const PAYMENT_TYPE_VALUES = ["PAID", "TO_PAY"] as const;
export const PAYMENT_MODE_VALUES = ["CASH", "UPI"] as const;

export const ConsignmentItemInputSchema = z.object({
  parcelType: z.enum(PARCEL_TYPE_VALUES),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  weightKg: z.number().positive("Weight must be greater than 0").optional().or(z.literal(1.0)),
  photoUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  remarks: z.string().optional().or(z.literal("")),
});

export const CreateBookingSchema = z.object({
  // Sender Details
  senderName: z.string().min(2, "Sender name must be at least 2 characters"),
  senderPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),
  senderEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  locationAccuracy: z.number().optional().nullable(),
  pickupAddress: z.string().optional().or(z.literal("")),

  // Receiver Details
  receiverName: z.string().min(2, "Receiver name must be at least 2 characters"),
  receiverPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit mobile number required"),

  // Route Selection
  originOfficeId: z.string().uuid("Invalid origin office selected"),
  destinationOfficeId: z.string().uuid("Invalid destination office selected"),

  // Pickup Method
  pickupMethod: z.enum(PICKUP_METHOD_VALUES).default("SELF_DROP"),
  pickupDistanceKm: z.number().nonnegative().optional().default(3.0),

  // Payment Options
  paymentType: z.enum(PAYMENT_TYPE_VALUES).default("PAID"),
  paymentMode: z.enum(PAYMENT_MODE_VALUES).default("CASH"),
  customOverridePrice: z.number().nonnegative("Custom price cannot be negative").optional().nullable(),
  specialNotes: z.string().optional().or(z.literal("")),

  // Multi-Item Consignments
  items: z.array(ConsignmentItemInputSchema).min(1, "At least one parcel item is required"),
}).refine(data => data.originOfficeId !== data.destinationOfficeId, {
  message: "Origin Office and Destination Office cannot be the same.",
  path: ["destinationOfficeId"],
});

export type ConsignmentItemInput = z.infer<typeof ConsignmentItemInputSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
