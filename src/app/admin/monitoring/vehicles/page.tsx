'use client';

import React, { useEffect, useState } from 'react';
import { getVehicleMonitoringAction } from '@/app/actions/admin/monitoring';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { Truck, Wrench, Shield, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FleetMonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFleet = async () => {
    const res = await getVehicleMonitoringAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFleet();
    const interval = setInterval(fetchFleet, 30000);
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Fleet Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Fleet Operations & Capacity Monitor</h1>
        </div>
        <LiveStatusIndicator />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Total Fleet</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">{data?.summary?.total || 0}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Running</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{data?.summary?.running || 0}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Idle Vehicles</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-1">{data?.summary?.idle || 0}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Maintenance</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-1">{data?.summary?.maintenance || 0}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-5 rounded-2xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Avg Fleet Util.</span>
          <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 block mt-1">{data?.summary?.avgUtilization || 0}%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Live Vehicle Fleet List</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading vehicle fleet metrics...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Vehicle Number</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Capacity (Tons)</th>
                  <th className="p-4">Capacity Util.</th>
                  <th className="p-4">Current Route</th>
                  <th className="p-4">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60">
                {data?.vehicles?.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 font-medium">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{v.registrationNumber}</td>
                    <td className="p-4">{v.vehicleType}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${v.status === 'IN_SERVICE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{v.capacityTons} T</td>
                    <td className="p-4 font-extrabold text-cyan-600 dark:text-cyan-400">{v.capacityPct}%</td>
                    <td className="p-4">{v.currentRoute}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{v.driverName}</td>
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
