import { z } from "zod";

export const PARCEL_TYPE_VALUES = ["ENVELOPE", "BOX", "MEDIUM_PARCEL", "LARGE_BUNDLE"] as const;
export const PICKUP_METHOD_VALUES = ["SELF_DROP", "TAXI_PICKUP"] as const;

export const PricingRuleRuleSchema = z.object({
  parcelType: z.enum(PARCEL_TYPE_VALUES),
  selfPrice: z.number().nonnegative("Self price must be a non-negative number"),
  taxiPrice: z.number().nonnegative("Taxi price must be non-negative").nullable().optional(),
  displayOrder: z.number().int().default(1),
});

export const PricingGroupSchema = z.object({
  name: z.string().min(2, "Pricing group name must be at least 2 characters"),
  description: z.string().optional().or(z.literal("")),
  isRajasthan: z.boolean().default(true),
  status: z.boolean().default(true),
  rules: z.array(PricingRuleRuleSchema).min(1, "At least one pricing rule is required"),
});

export const PriceCalculationSchema = z.object({
  originOfficeId: z.string().uuid("Invalid origin office selected"),
  destinationOfficeId: z.string().uuid("Invalid destination office selected"),
  parcelType: z.enum(PARCEL_TYPE_VALUES),
  pickupMethod: z.enum(PICKUP_METHOD_VALUES),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  distanceKm: z.number().nonnegative().optional(),
});

export type PricingGroupInput = z.infer<typeof PricingGroupSchema>;
export type PricingRuleInput = z.infer<typeof PricingRuleRuleSchema>;
export type PriceCalculationInput = z.infer<typeof PriceCalculationSchema>;
