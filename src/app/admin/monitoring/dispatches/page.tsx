'use client';

import React, { useEffect, useState } from 'react';
import { getDispatchMonitoringAction } from '@/app/actions/admin/monitoring';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { Package, Truck, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DispatchMonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDispatches = async () => {
    const res = await getDispatchMonitoringAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDispatches();
    const interval = setInterval(fetchDispatches, 30000);
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Live Dispatches</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Live Dispatch Operations</h1>
        </div>
        <LiveStatusIndicator />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Running Dispatches</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-1">{data?.summary?.totalRunning || 0}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Delayed Dispatches</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-1">{data?.summary?.delayedCount || 0}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">ETA Compliance</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{data?.summary?.etaCompliancePct || 0}%</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Avg Cargo Load</span>
          <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 block mt-1">{data?.summary?.avgLoadPct || 0}%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Active In-Transit Dispatches</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading live dispatches...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Manifest #</th>
                  <th className="p-4">Route Corridor</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Driver</th>
                  <th className="p-4">Departure</th>
                  <th className="p-4">Expected ETA</th>
                  <th className="p-4">Load Factor</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60">
                {data?.dispatches?.map((d: any) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 font-medium">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{d.manifestNumber}</td>
                    <td className="p-4 font-extrabold">{d.origin} → {d.destination}</td>
                    <td className="p-4 font-mono">{d.vehicleNumber}</td>
                    <td className="p-4">{d.driverName}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{d.departureTime ? new Date(d.departureTime).toLocaleTimeString() : 'N/A'}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{d.expectedArrivalTime ? new Date(d.expectedArrivalTime).toLocaleTimeString() : 'N/A'}</td>
                    <td className="p-4 font-extrabold text-cyan-600 dark:text-cyan-400">{d.loadPct}%</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${d.isDelayed ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                        {d.isDelayed ? 'DELAYED' : d.status}
                      </span>
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
