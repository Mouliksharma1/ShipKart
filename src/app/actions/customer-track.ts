"use server";

import { db } from "@/lib/db";
import { normalizeLRNumber } from "@/lib/utils/normalize-lr";

export async function customerTrackAction(lrNumber: string, phone: string) {
  try {
    const cleanLr = lrNumber.trim();
    const cleanPhone = phone.trim().replace(/\D/g, ""); // digits only

    if (!cleanLr) {
      return { success: false, error: "Please enter a valid LR Number." };
    }

    if (!cleanPhone || cleanPhone.length < 4) {
      return { success: false, error: "Please enter a valid 10-digit Sender or Receiver Phone Number for verification." };
    }

    const normalizedLR = normalizeLRNumber(cleanLr);
    const paddedLR = normalizedLR.padStart(4, "0");

    // Search booking matching LR number or UUID AND matching either senderPhone or receiverPhone
    const booking = await db.booking.findFirst({
      where: {
        OR: [
          { id: cleanLr }, // allow direct UUID search
          { lrNumber: normalizedLR },
          { lrNumber: paddedLR },
          { lrNumber: cleanLr },
        ],
        AND: [
          {
            OR: [
              { senderPhone: { contains: cleanPhone } },
              { receiverPhone: { contains: cleanPhone } },
            ],
          },
        ],
      },
      select: {
        id: true,
        lrNumber: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        error: "No matching consignment found with the provided LR / Tracking ID and Phone Number. Please verify your details.",
      };
    }

    return {
      success: true,
      trackingId: booking.id,
      lrNumber: booking.lrNumber,
    };
  } catch (err: any) {
    console.error("Customer Track Action Error:", err);
    return {
      success: false,
      error: "Something went wrong while searching for your consignment. Please try again.",
    };
  }
}
