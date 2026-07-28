'use client';

import React, { useEffect, useState } from 'react';
import { getCashBookAction, getTodayExpensesAction } from '@/app/actions/finance';
import { IndianRupee, TrendingUp, DollarSign, Building, Receipt, Lock, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminFinanceDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [cashRes, expRes] = await Promise.all([
      getCashBookAction(),
      getTodayExpensesAction()
    ]);

    if (cashRes.success && cashRes.data) setSummary(cashRes.data.summary);
    if (expRes.success && expRes.data) setExpenses(expRes.data);
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
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Enterprise Finance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Enterprise Financial Revenue & Cash Control</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/finance/reports"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition shadow-xs"
          >
            <FileText className="w-4 h-4 mr-1.5" /> Financial Reports & Audit Log
          </Link>
        </div>
      </div>

      {/* Enterprise Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Gross Booking Revenue</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">₹{(summary?.bookingCash || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Origin counter collections</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">To-Pay Clearances</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-2">₹{(summary?.toPayCollected || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Destination office clearances</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Network Expenses</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-2">₹{(summary?.expenses || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Fuel, salary & maintenance</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Net Revenue</span>
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block mt-2">₹{((summary?.bookingCash || 0) + (summary?.toPayCollected || 0) - (summary?.expenses || 0)).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Gross earnings minus expenses</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Recent Network Expenses</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading network expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No network expenses logged today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Branch Office</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 text-slate-500 font-mono">{new Date(exp.createdAt).toLocaleTimeString()}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{exp.office?.name || 'Head Office'}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{exp.description || '-'}</td>
                    <td className="p-4 text-right font-black text-rose-600">₹{exp.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
