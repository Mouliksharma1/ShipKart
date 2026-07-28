'use server';

import { addCashEntry, getTodayCashBook, getCashSummary } from '@/lib/services/finance/cashbook.service';
import { collectToPay, getPendingToPay } from '@/lib/services/finance/topay.service';
import { addExpense, getTodayExpenses, deleteExpense } from '@/lib/services/finance/expense.service';
import { closeOffice, getTodayClosing } from '@/lib/services/finance/office-closing.service';
import { CashTransactionType, ExpenseCategory } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function addCashEntryAction(input: {
  officeId: string;
  transactionType: CashTransactionType;
  amount: number;
  description?: string;
  createdBy: string;
}) {
  try {
    const data = await addCashEntry(input);
    revalidatePath('/employee/finance');
    revalidatePath('/employee/finance/cashbook');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function collectToPayAction(bookingId: string, collectedBy: string, officeId: string) {
  try {
    const data = await collectToPay(bookingId, collectedBy, officeId);
    revalidatePath('/employee/finance');
    revalidatePath('/employee/finance/topay');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getPendingToPayAction(officeId?: string, query?: string) {
  try {
    const data = await getPendingToPay(officeId, query);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function addExpenseAction(input: {
  officeId: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  createdBy: string;
}) {
  try {
    const data = await addExpense(input);
    revalidatePath('/employee/finance');
    revalidatePath('/employee/finance/expenses');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getTodayExpensesAction(officeId?: string) {
  try {
    const data = await getTodayExpenses(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteExpenseAction(id: string, userId: string) {
  try {
    const data = await deleteExpense(id, userId);
    revalidatePath('/employee/finance/expenses');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getCashBookAction(officeId?: string) {
  try {
    const list = await getTodayCashBook(officeId);
    const summary = await getCashSummary(officeId);
    return { success: true, data: { list, summary } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function closeOfficeAction(officeId: string, closedBy: string, remarks?: string) {
  try {
    const data = await closeOffice(officeId, closedBy, remarks);
    revalidatePath('/employee/finance');
    revalidatePath('/employee/finance/closing');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getTodayClosingAction(officeId?: string) {
  try {
    const data = await getTodayClosing(officeId);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
