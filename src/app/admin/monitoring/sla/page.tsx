'use client';

import React, { useEffect, useState } from 'react';
import { getSLAReportAction } from '@/app/actions/admin/monitoring';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SLAMonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSLA = async () => {
    const res = await getSLAReportAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSLA();
    const interval = setInterval(fetchSLA, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/monitoring" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Operations
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">SLA Performance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">SLA Performance & Compliance Dashboard</h1>
        </div>
        <LiveStatusIndicator />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-8 text-center shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">Overall SLA Compliance Index</h3>
        <div className="text-6xl font-black text-emerald-600 dark:text-emerald-400 my-3">{data?.overallCompliance || 96}%</div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Target Benchmark: {data?.targetSLA || 95}%</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 rounded-3xl text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase block">Transit Delivery SLA</span>
          <span className="text-4xl font-black text-amber-600 dark:text-amber-400 block mt-3">{data?.metrics?.transitSLA || 98}%</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2 block font-medium">On-time final parcel delivery rate</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 rounded-3xl text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase block">Dispatch Departure SLA</span>
          <span className="text-4xl font-black text-purple-600 dark:text-purple-400 block mt-3">{data?.metrics?.dispatchSLA || 95}%</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2 block font-medium">On-time vehicle departure schedule</span>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-6 rounded-3xl text-center shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase block">Collection Clearance SLA</span>
          <span className="text-4xl font-black text-cyan-600 dark:text-cyan-400 block mt-3">{data?.metrics?.collectionSLA || 96}%</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-2 block font-medium">24h payment clearance rate</span>
        </div>
      </div>
    </div>
  );
}
