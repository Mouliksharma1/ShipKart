'use client';

import React, { useEffect, useState } from 'react';
import { getPartnerDashboardAction } from '@/app/actions/partner';
import { Building2, Package, Truck, CheckCircle2, IndianRupee, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PartnerDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    const res = await getPartnerDashboardAction();
    if (res.success && res.data) {
      setSummary(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              PARTNER OFFICE TERMINAL
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-400 font-medium">Pooja Travels & Cargo</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Partner Destination Control</h1>
        </div>

        <button
          onClick={fetchDashboard}
          className="flex items-center px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 rounded-2xl text-xs font-extrabold transition shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Live Metrics
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/partner/incoming" className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 transition-all shadow-xs group block">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Incoming Dispatches</span>
            <Truck className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-2">{summary?.incomingDispatches || 0}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block flex items-center">
            Receive incoming vehicles <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </Link>

        <Link href="/partner/collections" className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 hover:border-blue-500 transition-all shadow-xs group block">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Pending Collections</span>
            <Package className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block mt-2">{summary?.pendingCollections || 0}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block flex items-center">
            Open OTP collection terminal <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </Link>

        <Link href="/partner/collections" className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 hover:border-emerald-500 transition-all shadow-xs group block">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Collected Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">{summary?.todayCollected || 0}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block flex items-center">
            View completed handovers <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </Link>

        <Link href="/partner/reports" className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 hover:border-purple-500 transition-all shadow-xs group block">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Today&apos;s Revenue</span>
            <IndianRupee className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block mt-2">₹{(summary?.todayRevenue || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block flex items-center">
            View office reports <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </Link>
      </div>


      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/partner/incoming"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs group"
        >
          <Truck className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Receive Dispatches</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Incoming Cargo Handovers</span>
        </Link>

        <Link
          href="/partner/collections"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs group"
        >
          <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Parcel Collections</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">OTP Handover Terminal</span>
        </Link>

        <Link
          href="/partner/dispatches"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs group"
        >
          <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Outgoing Dispatches</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Create Next Branch Run</span>
        </Link>

        <Link
          href="/partner/reports"
          className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs group"
        >
          <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Office Reports</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Revenue & Activity Logs</span>
        </Link>
      </div>
    </div>
  );
}
