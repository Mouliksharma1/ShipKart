import { z } from "zod";
import { ParcelType, PickupMethod } from "@prisma/client";

export const PricingRuleRuleSchema = z.object({
  parcelType: z.nativeEnum(ParcelType),
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
  parcelType: z.nativeEnum(ParcelType),
  pickupMethod: z.nativeEnum(PickupMethod),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  distanceKm: z.number().nonnegative().optional(),
});

export type PricingGroupInput = z.infer<typeof PricingGroupSchema>;
export type PricingRuleInput = z.infer<typeof PricingRuleRuleSchema>;
export type PriceCalculationInput = z.infer<typeof PriceCalculationSchema>;
