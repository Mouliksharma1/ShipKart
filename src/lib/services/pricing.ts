import { db } from "@/lib/db";
import { ParcelType, PickupMethod } from "@prisma/client";

export interface CalculatePriceInput {
  originOfficeId: string;
  destinationOfficeId: string;
  parcelType: ParcelType;
  pickupMethod: PickupMethod;
  quantity: number;
  pickupDistanceKm?: number; // Distance between Customer & Origin Office (for Taxi Pickup rule: <= 5 KM)
}

export interface PricingBreakdown {
  success: boolean;
  error?: string;
  resolutionStage?: "ROUTE_SPECIFIC" | "DESTINATION_SPECIFIC" | "RAJASTHAN_DEFAULT" | "OUTSIDE_RAJASTHAN_DEFAULT";
  pricingGroupName?: string;
  parcelType?: ParcelType;
  pickupMethod?: PickupMethod;
  unitPrice?: number;
  selfPrice?: number;
  taxiPrice?: number | null;
  subtotal?: number;
  pickupCharge?: number;
  grandTotal?: number;
  quantity?: number;
  pickupDistanceKm?: number;
  interStationDistanceKm?: number;
  taxiEligible?: boolean;
  taxiMessage?: string;
}

/**
 * SINGLE REUSABLE PRICING ENGINE SERVICE - calculatePrice()
 * Evaluates pricing priority hierarchy and Taxi Pickup rules (Customer-to-Office Distance <= 5 KM & Quantity >= 5)
 */
export async function calculatePrice(input: CalculatePriceInput): Promise<PricingBreakdown> {
  const { originOfficeId, destinationOfficeId, parcelType, pickupMethod, quantity } = input;

  if (quantity < 1) {
    return { success: false, error: "Quantity must be at least 1." };
  }

  try {
    // 1. Fetch Origin and Destination Offices
    const [originOffice, destinationOffice] = await Promise.all([
      db.officeMaster.findUnique({ where: { id: originOfficeId } }),
      db.officeMaster.findUnique({
        where: { id: destinationOfficeId },
        include: { pricingGroup: { include: { pricingRules: true } } },
      }),
    ]);

    if (!originOffice || !destinationOffice) {
      return { success: false, error: "Origin or Destination office not found." };
    }

    if (!originOffice.status || !destinationOffice.status) {
      return { success: false, error: "Cannot calculate pricing for inactive offices." };
    }

    // 2. Fetch RouteMaster Record between Origin and Destination
    const routeMaster = await db.routeMaster.findFirst({
      where: {
        originOfficeId,
        destinationOfficeId,
      },
      include: { pricingGroup: { include: { pricingRules: true } } },
    });

    const interStationDistanceKm = routeMaster?.distanceKm ?? 300;
    // Customer-to-Origin-Office Pickup Distance (for Taxi Pickup rule: <= 5 KM)
    const pickupDistanceKm = input.pickupDistanceKm ?? 3.0;

    // 3. PRIORITY RESOLUTION HIERARCHY
    // 1st: Route Specific Pricing -> 2nd: Destination Specific Pricing -> 3rd: Rajasthan Default -> 4th: Outside Rajasthan Default
    let resolvedPricingGroup: any = null;
    let resolutionStage: PricingBreakdown["resolutionStage"] = "OUTSIDE_RAJASTHAN_DEFAULT";

    if (routeMaster?.pricingGroup && routeMaster.pricingGroup.status) {
      resolvedPricingGroup = routeMaster.pricingGroup;
      resolutionStage = "ROUTE_SPECIFIC";
    } else if (destinationOffice.pricingGroup && destinationOffice.pricingGroup.status) {
      resolvedPricingGroup = destinationOffice.pricingGroup;
      resolutionStage = "DESTINATION_SPECIFIC";
    } else {
      const isBothRajasthan = originOffice.state === "Rajasthan" && destinationOffice.state === "Rajasthan";
      if (isBothRajasthan) {
        resolvedPricingGroup = await db.pricingGroup.findFirst({
          where: { isRajasthan: true, status: true },
          include: { pricingRules: true },
        });
        resolutionStage = "RAJASTHAN_DEFAULT";
      } else {
        resolvedPricingGroup = await db.pricingGroup.findFirst({
          where: { isRajasthan: false, status: true },
          include: { pricingRules: true },
        });
        resolutionStage = "OUTSIDE_RAJASTHAN_DEFAULT";
      }
    }

    if (!resolvedPricingGroup || !resolvedPricingGroup.pricingRules) {
      return { success: false, error: "No active pricing tariff rule found for this route." };
    }

    // Find normalized rule matching parcelType
    const matchingRule = resolvedPricingGroup.pricingRules.find(
      (r: any) => r.parcelType === parcelType
    );

    if (!matchingRule) {
      return { success: false, error: `No tariff rule configured for parcel type: ${parcelType}` };
    }

    // 4. TAXI PICKUP RESTRICTIONS & ELIGIBILITY EVALUATION
    // Rule: Distance between Customer & Office <= 5 KM AND Quantity >= 5 AND ParcelType != ENVELOPE
    let taxiEligible = true;
    let taxiMessage = "Taxi pickup available.";

    if (parcelType === ParcelType.ENVELOPE) {
      taxiEligible = false;
      taxiMessage = "Taxi Pickup is not available for Envelope consignments.";
    } else if (matchingRule.taxiPrice === null) {
      taxiEligible = false;
      taxiMessage = "Taxi Pickup is disabled for this item tariff.";
    } else if (pickupDistanceKm > 5) {
      taxiEligible = false;
      taxiMessage = `Taxi pickup unavailable: Customer distance (${pickupDistanceKm} KM) from origin office exceeds maximum 5 KM limit.`;
    } else if (quantity < 5) {
      taxiEligible = false;
      taxiMessage = `Taxi pickup unavailable: Quantity (${quantity}) is below minimum requirement of 5 items.`;
    }

    if (pickupMethod === PickupMethod.TAXI_PICKUP && !taxiEligible) {
      return {
        success: false,
        error: taxiMessage,
        taxiEligible: false,
        taxiMessage,
      };
    }

    // 5. PRICE CALCULATIONS
    const unitPrice =
      pickupMethod === PickupMethod.TAXI_PICKUP
        ? matchingRule.taxiPrice ?? matchingRule.selfPrice
        : matchingRule.selfPrice;

    const selfPrice = matchingRule.selfPrice;
    const taxiPrice = matchingRule.taxiPrice;

    const subtotal = unitPrice * quantity;
    const pickupCharge =
      pickupMethod === PickupMethod.TAXI_PICKUP
        ? Math.max(0, (unitPrice - selfPrice) * quantity)
        : 0;

    return {
      success: true,
      resolutionStage,
      pricingGroupName: resolvedPricingGroup.name,
      parcelType,
      pickupMethod,
      unitPrice,
      selfPrice,
      taxiPrice,
      subtotal,
      pickupCharge,
      grandTotal: subtotal,
      quantity,
      pickupDistanceKm,
      interStationDistanceKm,
      taxiEligible,
      taxiMessage,
    };
  } catch (err: any) {
    console.error("Calculate Price Error Details:", err);
    return {
      success: false,
      error: `Failed to calculate dynamic pricing breakdown: ${err?.message || String(err)}`,
    };
  }
}
