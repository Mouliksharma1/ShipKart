'use client';

import React, { useEffect, useState } from 'react';
import { getOfficeMonitoringAction } from '@/app/actions/admin/monitoring';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { Building, TrendingUp, AlertTriangle, Package, Truck, Users } from 'lucide-react';
import Link from 'next/link';

export default function OfficeMonitoringPage() {
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffices = async () => {
    const res = await getOfficeMonitoringAction();
    if (res.success && res.data) {
      setOffices(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffices();
    const interval = setInterval(fetchOffices, 30000);
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Office Monitoring</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Live Office Operations Monitoring</h1>
        </div>
        <LiveStatusIndicator />
      </div>

      {loading ? (
        <p className="text-xs text-slate-500 py-6 text-center">Loading live office metrics...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offices.map((off) => (
            <div key={off.id} className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-zinc-800 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{off.name}</h3>
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono font-bold">{off.code || 'BRANCH'} · {off.city}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold uppercase block">Health</span>
                  <span className={`text-base font-black ${off.healthScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {off.healthScore}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Today&apos;s Bookings</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5 block">{off.todayBookings}</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Today&apos;s Revenue</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">₹{off.todayRevenue.toLocaleString()}</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Pending Collections</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 text-sm mt-0.5 block">{off.pendingCollections}</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Delayed Shipments</span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm mt-0.5 block">{off.delayedShipments}</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Active Dispatches</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm mt-0.5 block">{off.activeDispatches}</span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
                  <span className="text-slate-500 dark:text-zinc-400 font-semibold block text-[10px] uppercase">Active Staff</span>
                  <span className="font-extrabold text-purple-600 dark:text-purple-400 text-sm mt-0.5 block">{off.activeEmployees}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
