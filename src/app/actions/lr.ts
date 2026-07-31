"use server";

import { cookies } from "next/headers";
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
export async function getLRDetailsAction(lrParam: string, isEmployeeAccess = false): Promise<LRDetailsResponse> {
  try {
    if (!lrParam) {
      return { success: false, error: "LR Identifier is required" };
    }

    const term = lrParam.trim();

    // Find booking either by unique UUID id or by sequential lrNumber
    const booking = await db.booking.findFirst({
      where: {
        OR: [
          { id: term },
          { lrNumber: { equals: term, mode: "insensitive" } }
        ]
      },
      include: {
        originOffice: true,
        destinationOffice: true,
        createdBy: {
          select: {
            name: true,
            employeeCode: true,
            phone: true,
            role: true,
          },
        },
        items: true,
        trackingHistory: {
          include: { office: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking) {
      return { success: false, error: `Digital LR document "${term}" was not found.` };
    }

    // Security Check: If accessed via plain sequential number (e.g. 0004 or SK0004)
    const isSequentialAccess = term.toLowerCase() === booking.lrNumber.toLowerCase() || /^\d{1,6}$/.test(term);

    if (isSequentialAccess) {
      if (!isEmployeeAccess) {
        return { 
          success: false, 
          error: `Access Restricted. Sequential LR lookup ("${term}") is strictly permitted for employees on the Staff Terminal (/employee/bookings/${term}). Public access requires a 12-character alphanumeric secure LR key.` 
        };
      }

      const cookieStore = await cookies();
      const staffId = cookieStore.get("shipkart_staff_id")?.value;
      if (!staffId) {
        return { 
          success: false, 
          error: `Access Restricted. Sequential LR lookup ("${term}") requires an active employee session on the Staff Terminal.` 
        };
      }
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
