import { z } from "zod";

export const OfficeSchema = z.object({
  name: z.string().min(2, "Office name must be at least 2 characters"),
  code: z.string().min(2, "Office code must be at least 2 characters").toUpperCase().optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name required"),
  state: z.string().min(2, "State name required"),
  pinCode: z.string().regex(/^[0-9]{6}$/, "Valid 6-digit PIN code required"),
  country: z.string().default("India"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Valid phone number required"),
  altPhone: z.string().optional().or(z.literal("")),
  managerName: z.string().optional().or(z.literal("")),
  managerPhone: z.string().optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
  googleMapsUrl: z.string().url("Invalid Google Maps URL").optional().or(z.literal("")),
  openingTime: z.string().default("04:00 AM"),
  closingTime: z.string().default("11:00 PM"),
  status: z.boolean().default(true),
});

export const RouteSchema = z.object({
  originOfficeId: z.string().uuid("Invalid origin office selected"),
  destinationOfficeId: z.string().uuid("Invalid destination office selected"),
  distanceKm: z.number().positive("Distance must be greater than 0"),
  etaHours: z.number().positive("ETA hours must be greater than 0"),
  operatingDays: z.string().default("Daily"),
  departureTime: z.string().default("08:00 PM"),
  arrivalTime: z.string().default("06:00 AM"),
  routeStatus: z.enum(["ACTIVE", "INACTIVE", "TEMPORARILY_CLOSED"]).default("ACTIVE"),
  pricingGroupId: z.string().uuid("Invalid pricing group selected").optional().or(z.literal("")),
  status: z.boolean().default(true),
}).refine(data => data.originOfficeId !== data.destinationOfficeId, {
  message: "Origin Office and Destination Office cannot be the same.",
  path: ["destinationOfficeId"],
});

export type OfficeInput = z.infer<typeof OfficeSchema>;
export type RouteInput = z.infer<typeof RouteSchema>;
