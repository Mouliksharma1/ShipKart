'use server';

import { receiveDispatch, unloadParcel } from '@/lib/services/collection/dispatch-receive.service';
import { generateOTP, verifyOTP, resendOTP } from '@/lib/services/collection/otp.service';
import { getPendingCollections, getCollectedToday, collectParcel } from '@/lib/services/collection/collection.service';
import { revalidatePath } from 'next/cache';

export async function receiveDispatchAction(dispatchId: string, userId?: string) {
  try {
    const data = await receiveDispatch(dispatchId, userId);
    revalidatePath('/employee/collections');
    revalidatePath('/employee/dispatches');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function unloadParcelAction(bookingId: string, userId?: string) {
  try {
    const data = await unloadParcel(bookingId, userId);
    revalidatePath('/employee/collections');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function generateOTPAction(bookingId: string) {
  try {
    const data = await generateOTP(bookingId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function verifyOTPAction(bookingId: string, otp: string) {
  try {
    const data = await verifyOTP(bookingId, otp);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function collectParcelAction(bookingId: string, otpCode: string, collectedByName: string, userId?: string) {
  try {
    const data = await collectParcel(bookingId, otpCode, collectedByName, userId);
    revalidatePath('/employee/collections');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPendingCollectionsAction(officeId?: string, query?: string) {
  try {
    const data = await getPendingCollections(officeId, query);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCollectedBookingsAction(officeId?: string) {
  try {
    const data = await getCollectedToday(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
