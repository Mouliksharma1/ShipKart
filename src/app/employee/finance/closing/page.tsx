'use client';

import React, { useEffect, useState } from 'react';
import { getCashBookAction, getTodayClosingAction, closeOfficeAction } from '@/app/actions/finance';
import { Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OfficeClosingPage() {
  const [summary, setSummary] = useState<any>(null);
  const [closing, setClosing] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [closingDone, setClosingDone] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [cashRes, closingRes] = await Promise.all([
      getCashBookAction(),
      getTodayClosingAction()
    ]);

    if (cashRes.success && cashRes.data) setSummary(cashRes.data.summary);
    if (closingRes.success && closingRes.data) {
      setClosing(closingRes.data);
      setClosingDone(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await closeOfficeAction('DEFAULT', 'COUNTER_STAFF', remarks);
    if (res.success) {
      setClosingDone(true);
      fetchData();
    }
    setLoading(false);
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Office Closing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">End of Day Office Cash Settlement & Closing</h1>
        </div>
      </div>

      {closingDone ? (
        <div className="bg-white dark:bg-zinc-900 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Office Closing Completed & Locked</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Daily financial settlement logged at {closing?.closedAt ? new Date(closing.closedAt).toLocaleTimeString() : 'today'}.
          </p>

          <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-200 dark:border-zinc-800 text-left">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Closing Cash Locked</span>
              <span className="font-black text-emerald-600 text-base">₹{(closing?.closingCash || summary?.currentBalance || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Closed By</span>
              <span className="font-extrabold text-slate-900 dark:text-white">{closing?.closedBy || 'COUNTER_STAFF'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-200/60 dark:border-zinc-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Daily Financial Reconciliation</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Verify counter cash and submit end-of-day office settlement</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">Opening Float</span>
              <span className="font-black text-slate-900 dark:text-white text-base">₹{(summary?.openingCash || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">Booking Collections</span>
              <span className="font-black text-emerald-600 text-base">+₹{(summary?.bookingCash || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">To-Pay Collections</span>
              <span className="font-black text-amber-600 text-base">+₹{(summary?.toPayCollected || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 block font-semibold text-[10px] uppercase">Expenses</span>
              <span className="font-black text-rose-600 text-base">-₹{(summary?.expenses || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-amber-950 dark:text-amber-200">
            <span className="text-xs font-extrabold uppercase">Expected Physical Cash in Drawer</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{(summary?.currentBalance || 0).toLocaleString('en-IN')}</span>
          </div>

          <form onSubmit={handleCloseOffice} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Closing Remarks / Discrepancies</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Cash verified and handed over to manager..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-extrabold transition shadow-xs flex items-center justify-center"
            >
              <Lock className="w-4 h-4 mr-2" /> {loading ? 'Locking Office Day...' : 'Lock & Complete Office Closing'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
