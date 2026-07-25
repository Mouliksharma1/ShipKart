"use server";

import { db } from "@/lib/db";
import { generateQRCodeDataUrl } from "@/lib/services/qrcode";

export type LRDetailsResponse = {
  success: boolean;
  message?: string;
  data?: any;
  companySettings?: any;
  qrCodeDataUrl?: string;
  error?: string;
};

/**
 * GET FULL DIGITAL LR DETAILS
 * Returns complete booking, items, offices, company settings, and generated QR Code.
 */
export async function getLRDetailsAction(lrNumber: string): Promise<LRDetailsResponse> {
  try {
    if (!lrNumber) {
      return { success: false, error: "LR Number is required" };
    }

    const booking = await db.booking.findUnique({
      where: { lrNumber },
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
        trackingHistory: {
          include: { office: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking) {
      return { success: false, error: `LR Document ${lrNumber} was not found.` };
    }

    // Company Settings
    const companySettings = await db.companySettings.findFirst({
      where: { id: "default" },
    });

    // Generate QR Code Data URL (pointing to /track/SK...)
    const qrCodeDataUrl = await generateQRCodeDataUrl(booking.lrNumber);

    return {
      success: true,
      data: booking,
      companySettings,
      qrCodeDataUrl,
    };
  } catch (err: any) {
    console.error("Get LR Details Error:", err);
    return {
      success: false,
      error: `Failed to load Digital LR: ${err?.message || String(err)}`,
    };
  }
}

/**
 * GET PUBLIC TRACKING DETAILS FOR QR SCANNER / UNAUTHENTICATED USERS
 * Security Rule: Never exposes phone numbers, payment details, internal notes, or audit logs.
 */
export async function getTrackingForLRAction(lrNumber: string) {
  try {
    if (!lrNumber) {
      return { success: false, error: "LR Number is required" };
    }

    const booking = await db.booking.findUnique({
      where: { lrNumber },
      select: {
        id: true,
        lrNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        originOffice: {
          select: {
            name: true,
            city: true,
            address: true,
            phone: true,
          },
        },
        destinationOffice: {
          select: {
            name: true,
            city: true,
            address: true,
            phone: true,
            openingTime: true,
            closingTime: true,
          },
        },
        items: {
          select: {
            parcelType: true,
            quantity: true,
            weightKg: true,
          },
        },
        trackingHistory: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            notes: true,
            office: {
              select: {
                name: true,
                city: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking) {
      return { success: false, error: `Parcel with LR Number ${lrNumber} not found.` };
    }

    const companySettings = await db.companySettings.findFirst({
      where: { id: "default" },
      select: {
        companyName: true,
        helpline1: true,
        helpline2: true,
        helpline3: true,
      },
    });

    return {
      success: true,
      data: booking,
      companySettings,
    };
  } catch (err: any) {
    console.error("Get Tracking Error:", err);
    return {
      success: false,
      error: "Failed to fetch tracking information.",
    };
  }
}
