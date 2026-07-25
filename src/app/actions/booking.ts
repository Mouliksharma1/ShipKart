"use server";

import { db } from "@/lib/db";
import { calculatePrice } from "@/lib/services/pricing";
import { generateNextLRNumber } from "@/lib/services/lr-generator";
import { CreateBookingSchema, CreateBookingInput } from "@/lib/validations/booking";
import { PickupMethod, BookingStatus, NotificationRecipient, NotificationChannel, NotificationStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type BookingActionResult = {
  success: boolean;
  message?: string;
  lrNumber?: string;
  bookingId?: string;
  error?: string;
};

/**
 * CREATE BOOKING SERVER ACTION
 * Executes single atomic Prisma $transaction:
 * 1. Server-side Price Recalculation Loop & Taxi Eligibility Check
 * 2. Generate Global LR Number (SK000000001)
 * 3. Create Master Booking Record
 * 4. Create ConsignmentItems with Immutable Price Snapshots
 * 5. Create Initial TrackingHistory (BOOKED)
 * 6. Enqueue Sender & Receiver NotificationQueue items
 */
export async function createBookingAction(formData: unknown): Promise<BookingActionResult> {
  const parseResult = CreateBookingSchema.safeParse(formData);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.issues[0]?.message || "Invalid booking data" };
  }

  const data = parseResult.data;

  try {
    // SERVER-SIDE PRICE SECURITY RE-CALCULATION
    // Recalculate price for every parcel item using central calculatePrice() service
    let totalSubtotal = 0;
    let totalPickupCharge = 0;
    const evaluatedItems: Array<{
      parcelType: any;
      quantity: number;
      weightKg?: number;
      photoUrl?: string | null;
      remarks?: string | null;
      unitPrice: number;
      selfPrice: number;
      taxiPrice: number | null;
      subtotal: number;
      itemPickupCharge: number;
    }> = [];

    const totalQuantity = data.items.reduce((acc, item) => acc + item.quantity, 0);

    for (const item of data.items) {
      const priceRes = await calculatePrice({
        originOfficeId: data.originOfficeId,
        destinationOfficeId: data.destinationOfficeId,
        parcelType: item.parcelType,
        pickupMethod: data.pickupMethod,
        quantity: item.quantity,
        pickupDistanceKm: data.pickupDistanceKm,
      });

      if (!priceRes.success) {
        return {
          success: false,
          error: `Price calculation failed for item ${item.parcelType}: ${priceRes.error}`,
        };
      }

      // Taxi Eligibility Check across multi-item total quantity
      if (data.pickupMethod === PickupMethod.TAXI_PICKUP) {
        if (item.parcelType === "ENVELOPE") {
          return { success: false, error: "Taxi Pickup is not available for Envelope consignments." };
        }
        if (totalQuantity < 5) {
          return { success: false, error: `Taxi pickup unavailable: Total parcel quantity (${totalQuantity}) is below minimum 5 items.` };
        }
      }

      const unitPrice = priceRes.unitPrice || 0;
      const selfPrice = priceRes.selfPrice || 0;
      const taxiPrice = priceRes.taxiPrice ?? null;
      const subtotal = priceRes.subtotal || 0;
      const itemPickupCharge = priceRes.pickupCharge || 0;

      totalSubtotal += subtotal;
      totalPickupCharge += itemPickupCharge;

      evaluatedItems.push({
        parcelType: item.parcelType,
        quantity: item.quantity,
        weightKg: item.weightKg || 1.0,
        photoUrl: item.photoUrl || null,
        remarks: item.remarks || null,
        unitPrice,
        selfPrice,
        taxiPrice,
        subtotal,
        itemPickupCharge,
      });
    }

    const grandTotal = totalSubtotal;

    // EXECUTE SINGLE ATOMIC PRISMA TRANSACTION
    const createdBooking = await db.$transaction(async (tx) => {
      // Step 1: Generate Monotonic Global LR Number (SK000000001)
      let seq = await tx.lRSequence.findFirst({ where: { id: 1 } });
      if (!seq) {
        seq = await tx.lRSequence.create({ data: { id: 1, lastNumber: 0 } });
      }

      const nextNumber = seq.lastNumber + 1;
      await tx.lRSequence.update({
        where: { id: 1 },
        data: { lastNumber: nextNumber },
      });

      const lrNumber = `SK${String(nextNumber).padStart(9, "0")}`;

      // Step 2: Create Booking Master Record
      const booking = await tx.booking.create({
        data: {
          lrNumber,
          senderName: data.senderName,
          senderPhone: data.senderPhone,
          senderEmail: data.senderEmail || null,
          receiverName: data.receiverName,
          receiverPhone: data.receiverPhone,
          originOfficeId: data.originOfficeId,
          destinationOfficeId: data.destinationOfficeId,
          pickupMethod: data.pickupMethod,
          pickupAddress: data.pickupAddress || null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          locationAccuracy: data.locationAccuracy || null,
          paymentType: data.paymentType,
          paymentMode: data.paymentMode,
          paymentStatus: data.paymentType === "PAID",
          subtotalAmount: totalSubtotal - totalPickupCharge,
          totalPickupCharge: totalPickupCharge,
          totalAmount: grandTotal,
          specialNotes: data.specialNotes || null,
          status: BookingStatus.BOOKED,
        },
      });

      // Step 3: Create ConsignmentItems with Immutable Price Snapshots
      await tx.consignmentItem.createMany({
        data: evaluatedItems.map((item) => ({
          bookingId: booking.id,
          parcelType: item.parcelType,
          quantity: item.quantity,
          weightKg: item.weightKg,
          photoUrl: item.photoUrl,
          remarks: item.remarks,
          unitPrice: item.unitPrice,
          selfPrice: item.selfPrice,
          taxiPrice: item.taxiPrice,
          subtotal: item.subtotal,
          itemPickupCharge: item.itemPickupCharge,
        })),
      });

      // Step 4: Create Initial TrackingHistory (BOOKED)
      await tx.trackingHistory.create({
        data: {
          bookingId: booking.id,
          status: BookingStatus.BOOKED,
          officeId: data.originOfficeId,
          notes: `Consignment booked successfully online. LR Number: ${lrNumber}`,
        },
      });

      // Step 5: Enqueue NotificationQueue Records (For Milestone 9 Consumption)
      await tx.notificationQueue.createMany({
        data: [
          {
            bookingId: booking.id,
            recipientType: NotificationRecipient.SENDER,
            phone: data.senderPhone,
            channel: NotificationChannel.WHATSAPP,
            message: `ShipKart: Your booking ${lrNumber} has been confirmed! Total: ₹${grandTotal}. Track online at ShipKart.`,
            status: NotificationStatus.PENDING,
          },
          {
            bookingId: booking.id,
            recipientType: NotificationRecipient.RECEIVER,
            phone: data.receiverPhone,
            channel: NotificationChannel.WHATSAPP,
            message: `ShipKart: A parcel (${lrNumber}) has been booked for you by ${data.senderName}.`,
            status: NotificationStatus.PENDING,
          },
        ],
      });

      return booking;
    }, { timeout: 25000 });

    revalidatePath("/customer");
    revalidatePath("/customer/history");
    return {
      success: true,
      message: "Booking confirmed successfully!",
      lrNumber: createdBooking.lrNumber,
      bookingId: createdBooking.id,
    };
  } catch (err: any) {
    console.error("Create Booking Action Error:", err);
    return {
      success: false,
      error: `Failed to confirm booking: ${err?.message || String(err)}`,
    };
  }
}

export async function getCustomerBookingsAction(searchQuery?: string) {
  try {
    const bookings = await db.booking.findMany({
      include: {
        originOffice: true,
        destinationOffice: true,
        items: true,
      },
      where: searchQuery ? {
        OR: [
          { lrNumber: { contains: searchQuery, mode: "insensitive" } },
          { senderPhone: { contains: searchQuery } },
          { receiverPhone: { contains: searchQuery } },
          { receiverName: { contains: searchQuery, mode: "insensitive" } },
        ],
      } : {},
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bookings };
  } catch (err) {
    console.error("Get Customer Bookings Error:", err);
    return { success: false, error: "Failed to fetch bookings history.", data: [] };
  }
}

export async function getBookingDetailsAction(lrNumber: string) {
  try {
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
      return { success: false, error: `Booking with LR Number ${lrNumber} was not found.` };
    }

    return { success: true, data: booking };
  } catch (err) {
    console.error("Get Booking Details Error:", err);
    return { success: false, error: "Failed to fetch booking details." };
  }
}
