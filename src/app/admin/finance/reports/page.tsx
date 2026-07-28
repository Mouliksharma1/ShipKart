'use client';

import React, { useEffect, useState } from 'react';
import { getCashBookAction, getTodayClosingAction } from '@/app/actions/finance';
import { FileText, Download, Calendar, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminFinancialReportsPage() {
  const [data, setData] = useState<any>(null);
  const [closing, setClosing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [cashRes, closingRes] = await Promise.all([
      getCashBookAction(),
      getTodayClosingAction()
    ]);

    if (cashRes.success && cashRes.data) setData(cashRes.data);
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
            <Link href="/admin/finance" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Enterprise Finance
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Reports & Audit Log</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Daily Financial Settlement & Audit Report</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Daily Financial Audit Ledger</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading audit log...</p>
        ) : data?.list?.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No financial audit records available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Office Branch</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">LR #</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {data?.list?.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 text-slate-500 font-mono">{new Date(entry.createdAt).toLocaleTimeString()}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{entry.office?.name || 'Head Office'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${entry.transactionType === 'EXPENSE' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {entry.transactionType}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{entry.booking?.lrNumber || '-'}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{entry.description || '-'}</td>
                    <td className={`p-4 text-right font-black ${entry.transactionType === 'EXPENSE' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {entry.transactionType === 'EXPENSE' ? '-' : '+'}₹{entry.amount.toLocaleString('en-IN')}
                    </td>
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
