'use server';

import { getCustomerProfile, updateCustomerProfile, getBookingHistory, getCustomerBookingDetails } from '@/lib/services/customer/customer.service';
import { revalidatePath } from 'next/cache';

export async function getProfileAction(phoneOrEmail: string) {
  try {
    const data = await getCustomerProfile(phoneOrEmail);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProfileAction(phoneOrEmail: string, profileData: any) {
  try {
    const data = await updateCustomerProfile(phoneOrEmail, profileData);
    revalidatePath('/customer/profile');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getBookingHistoryAction(customerPhone: string, query?: string, statusFilter?: string) {
  try {
    const data = await getBookingHistory(customerPhone, query, statusFilter);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getBookingDetailsAction(bookingIdOrLr: string, customerPhone: string) {
  try {
    const data = await getCustomerBookingDetails(bookingIdOrLr, customerPhone);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
