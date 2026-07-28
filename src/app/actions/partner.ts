'use server';

import { getPartnerDashboardSummary, getIncomingDispatches, getPartnerOfficeReport } from '@/lib/services/partner/partner-dashboard.service';
import { receiveDispatch, unloadParcel } from '@/lib/services/collection/dispatch-receive.service';
import { collectParcel, getPendingCollections } from '@/lib/services/collection/collection.service';
import { revalidatePath } from 'next/cache';

export async function getPartnerDashboardAction(officeId?: string) {
  try {
    const data = await getPartnerDashboardSummary(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getIncomingDispatchesAction(officeId?: string) {
  try {
    const data = await getIncomingDispatches(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function receivePartnerDispatchAction(dispatchId: string, userId?: string) {
  try {
    const data = await receiveDispatch(dispatchId, userId);
    revalidatePath('/partner');
    revalidatePath('/partner/incoming');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPartnerCollectionsAction(officeId?: string, query?: string) {
  try {
    const data = await getPendingCollections(officeId, query);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function completePartnerCollectionAction(bookingId: string, otpCode: string, collectedByName: string, userId?: string) {
  try {
    const data = await collectParcel(bookingId, otpCode, collectedByName, userId);
    revalidatePath('/partner/collections');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPartnerOfficeReportAction(officeId?: string, startDate?: string, endDate?: string) {
  try {
    const data = await getPartnerOfficeReport(officeId, startDate, endDate);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
