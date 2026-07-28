'use client';

import React, { useEffect, useState } from 'react';
import { getTodayExpensesAction, addExpenseAction, deleteExpenseAction } from '@/app/actions/finance';
import { TrendingUp, PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OfficeExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [category, setCategory] = useState<any>('OFFICE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const fetchExpenses = async () => {
    setLoading(true);
    const res = await getTodayExpensesAction();
    if (res.success && res.data) {
      setExpenses(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    await addExpenseAction({
      officeId: 'DEFAULT',
      category,
      amount: Number(amount),
      description,
      createdBy: 'COUNTER_STAFF'
    });
    setIsAddModalOpen(false);
    setAmount('');
    setDescription('');
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    await deleteExpenseAction(id, 'COUNTER_STAFF');
    fetchExpenses();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/employee/finance" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Finance
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Office Expenses</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Branch Cash Out & Expense Management</h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-extrabold transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" /> Record Expense
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Today&apos;s Expense Vouchers</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No office expenses recorded today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 text-slate-500 font-mono">{new Date(exp.createdAt).toLocaleTimeString()}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4">{exp.description || '-'}</td>
                    <td className="p-4 text-right font-black text-rose-600">₹{exp.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(exp.id)} className="p-2 text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <form onSubmit={handleAddExpense} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Record New Office Expense</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Expense Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="DIESEL">DIESEL / FUEL</option>
                <option value="SALARY">STAFF SALARY ADVANCE</option>
                <option value="OFFICE">OFFICE SUPPLIES</option>
                <option value="MAINTENANCE">VEHICLE MAINTENANCE</option>
                <option value="FOOD">STAFF REFRESHMENTS / FOOD</option>
                <option value="OTHER">OTHER EXPENSE</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Expense Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Remarks / Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Diesel for truck RJ19-1234"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-extrabold">Save Expense</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
