import { z } from "zod";
import { ParcelType, PickupMethod, PaymentType, PaymentMode } from "@prisma/client";

export const ConsignmentItemInputSchema = z.object({
  parcelType: z.nativeEnum(ParcelType),
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
  pickupMethod: z.nativeEnum(PickupMethod).default(PickupMethod.SELF_DROP),
  pickupDistanceKm: z.number().nonnegative().optional().default(3.0),

  // Payment Options
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.PAID),
  paymentMode: z.nativeEnum(PaymentMode).default(PaymentMode.CASH),
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
