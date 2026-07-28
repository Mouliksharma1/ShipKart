'use client';

import React, { useEffect, useState } from 'react';
import { getCashBookAction, getTodayClosingAction } from '@/app/actions/finance';
import { IndianRupee, TrendingUp, AlertTriangle, Receipt, Lock, PlusCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeFinanceDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [closing, setClosing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [cashRes, closingRes] = await Promise.all([
      getCashBookAction(),
      getTodayClosingAction()
    ]);

    if (cashRes.success && cashRes.data) setSummary(cashRes.data.summary);
    if (closingRes.success) setClosing(closingRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/employee" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Employee Portal
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Financial Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Daily Finance & Cash Book Engine</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/employee/finance/closing"
            className="flex items-center px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-extrabold transition shadow-xs"
          >
            <Lock className="w-4 h-4 mr-1.5" /> Office Closing Screen
          </Link>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Opening Cash Balance</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white block mt-2">₹{(summary?.openingCash || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Carried forward / opening float</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Today&apos;s Booking Revenue</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">₹{(summary?.bookingCash || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Counter paid parcel collections</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">To-Pay Collections</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-2">₹{(summary?.toPayCollected || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Destination collection clearances</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Today&apos;s Expenses</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-2">₹{(summary?.expenses || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Fuel, salary, maintenance & office cash out</span>
        </div>
      </div>

      {/* Net Current Balance Box */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 p-6 rounded-3xl text-amber-950 dark:text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider opacity-90 block">Current Cash Drawer Balance</span>
          <h2 className="text-4xl font-black mt-1">₹{(summary?.currentBalance || 0).toLocaleString('en-IN')}</h2>
          <p className="text-xs opacity-90 mt-1">Net physical cash available in counter drawer</p>
        </div>
        <Link
          href="/employee/finance/cashbook"
          className="flex items-center justify-center px-5 py-3 bg-white text-slate-900 font-extrabold rounded-2xl text-xs shadow-sm hover:bg-slate-100 transition-all shrink-0"
        >
          View Full Cash Book <ArrowRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      {/* Navigation Module Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/employee/finance/cashbook"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs"
        >
          <Receipt className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Daily Cash Book</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Transactions & Float</span>
        </Link>

        <Link
          href="/employee/finance/topay"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs"
        >
          <IndianRupee className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">To-Pay Collections</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Clear Pending Balances</span>
        </Link>

        <Link
          href="/employee/finance/expenses"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs"
        >
          <TrendingUp className="w-6 h-6 text-rose-600 dark:text-rose-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Office Expenses</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Fuel, Salary & Supplies</span>
        </Link>

        <Link
          href="/employee/finance/closing"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs"
        >
          <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Office Closing</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Daily Reconciliation</span>
        </Link>
      </div>
    </div>
  );
}
