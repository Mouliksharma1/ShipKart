import { db as prisma } from '@/lib/db';
import { ExpenseCategory } from '@prisma/client';
import { addCashEntry } from './cashbook.service';
import { createActivityLog } from '@/lib/services/admin/activity.service';

export interface AddExpenseInput {
  officeId: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  createdBy: string;
}

export async function addExpense(input: AddExpenseInput) {
  const expense = await prisma.expense.create({
    data: {
      officeId: input.officeId,
      category: input.category,
      amount: input.amount,
      description: input.description,
      createdBy: input.createdBy
    }
  });

  // Record in CashBook
  await addCashEntry({
    officeId: input.officeId,
    transactionType: 'EXPENSE',
    amount: input.amount,
    description: `Expense [${input.category}]: ${input.description || ''}`,
    createdBy: input.createdBy
  });

  await createActivityLog({
    userId: input.createdBy,
    module: 'FINANCE',
    entity: 'Expense',
    entityId: expense.id,
    action: `Added ${input.category} expense of ₹${input.amount}`
  }).catch(() => null);

  return expense;
}

export async function getTodayExpenses(officeId?: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const whereClause: any = { createdAt: { gte: startOfDay } };
  if (officeId) whereClause.officeId = officeId;

  return prisma.expense.findMany({
    where: whereClause,
    include: { office: { select: { name: true, city: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function deleteExpense(id: string, userId: string) {
  const expense = await prisma.expense.delete({
    where: { id }
  });

  await createActivityLog({
    userId,
    module: 'FINANCE',
    entity: 'Expense',
    entityId: id,
    action: `Deleted ${expense.category} expense of ₹${expense.amount}`
  }).catch(() => null);

  return expense;
}
