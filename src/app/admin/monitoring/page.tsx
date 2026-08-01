'use client';

import React, { useEffect, useState } from 'react';
import { getExecutiveDashboardAction } from '@/app/actions/admin/monitoring';
import { BusinessHealthCard } from '@/components/monitoring/BusinessHealthCard';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { StatCard } from '@/components/admin/StatCard';
import { Activity, Bell, Building, Truck, Users, Package, Clock, ShieldCheck, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

import { DatabaseHealthCard } from '@/components/monitoring/DatabaseHealthCard';
import { SystemCleanupCard } from '@/components/admin/SystemCleanupCard';

export default function MonitoringControlCenterPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const res = await getExecutiveDashboardAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 p-10 text-center text-slate-500 dark:text-zinc-400 font-semibold text-sm">
        Loading Enterprise Operations Monitoring Control Center...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Real-Time Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Enterprise Operations Control Center</h1>
        </div>
        <div className="flex items-center space-x-3">
          <LiveStatusIndicator />
          <Link
            href="/admin/monitoring/alerts"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition-all shadow-xs"
          >
            <Bell className="w-4 h-4 mr-1.5" /> View Active Alerts
          </Link>
        </div>
      </div>

      {/* Top Grid: Business Health & Real-time Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BusinessHealthCard
            score={data?.businessHealth?.score || 95}
            rating={data?.businessHealth?.rating || 'Excellent'}
            breakdown={data?.businessHealth?.breakdown}
          />
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Today's Revenue"
            value={`₹${(data?.todayRevenue || 0).toLocaleString('en-IN')}`}
            subtitle="Live collection total"
            variant="emerald"
            icon={<TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          />
          <StatCard
            title="Today's Bookings"
            value={data?.todayBookings || 0}
            subtitle="Parcels accepted today"
            variant="amber"
            icon={<Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          />
          <StatCard
            title="Active Dispatches"
            value={data?.activeDispatches || 0}
            subtitle="Cargo manifests in transit"
            variant="default"
            icon={<Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          />
          <StatCard
            title="Active Vehicles"
            value={data?.activeVehicles || 0}
            subtitle="Running on routes"
            variant="default"
            icon={<Truck className="w-5 h-5 text-slate-600 dark:text-zinc-400" />}
          />
          <StatCard
            title="Pending Collections"
            value={data?.pendingCollections || 0}
            subtitle="To-Pay uncollected balances"
            variant="rose"
            icon={<AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          />
          <StatCard
            title="Delayed Shipments"
            value={data?.delayedShipments || 0}
            subtitle="Pending dispatch / delivery"
            variant="rose"
            icon={<Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          />
        </div>
      </div>

      {/* Database Health Monitoring & Latency Check */}
      <DatabaseHealthCard />

      {/* System Maintenance & Cleanup Control */}
      <SystemCleanupCard />

      {/* Monitoring Subpage Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Link
          href="/admin/monitoring/offices"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500/50 rounded-2xl flex flex-col items-center text-center group transition-all shadow-xs"
        >
          <Building className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Offices Monitor</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Branch Health & Rev</span>
        </Link>

        <Link
          href="/admin/monitoring/vehicles"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500/50 rounded-2xl flex flex-col items-center text-center group transition-all shadow-xs"
        >
          <Truck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Fleet Monitor</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Capacity & Util %</span>
        </Link>

        <Link
          href="/admin/monitoring/employees"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500/50 rounded-2xl flex flex-col items-center text-center group transition-all shadow-xs"
        >
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Staff Productivity</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Leaderboard & Speeds</span>
        </Link>

        <Link
          href="/admin/monitoring/dispatches"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500/50 rounded-2xl flex flex-col items-center text-center group transition-all shadow-xs"
        >
          <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Live Dispatches</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Manifests & Load %</span>
        </Link>

        <Link
          href="/admin/monitoring/sla"
          className="p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500/50 rounded-2xl flex flex-col items-center text-center group transition-all shadow-xs"
        >
          <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">SLA Matrix</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Transit Compliance</span>
        </Link>
      </div>

      {/* Operations Highlights Card */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white mb-4">Operations Overview Today</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-5 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block">Completed Deliveries</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{data?.overview?.completedToday || 0}</span>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block">Loaded Cargo Manifests</span>
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-1">{data?.overview?.loadedToday || 0}</span>
          </div>
          <div className="p-5 bg-slate-50 dark:bg-zinc-950/50 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block">Cancelled Bookings</span>
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-1">{data?.overview?.cancelledToday || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
