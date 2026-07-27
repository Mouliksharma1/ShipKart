import React from 'react';
import { getRouteAnalytics } from '@/lib/services/analytics/route.service';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { MapPin, ArrowRightLeft, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RoutesReportPage() {
  const data = await getRouteAnalytics();

  const exportHeaders = ['Route Code', 'Corridor', 'Distance (Km)', 'Dispatches', 'Revenue (₹)', 'ETA Compliance (%)'];
  const exportData = data.routeStats.map((r) => ({
    'Route Code': r.routeCode,
    'Corridor': r.corridor,
    'Distance (Km)': r.distanceKm,
    'Dispatches': r.totalDispatches,
    'Revenue (₹)': r.totalRevenue,
    'ETA Compliance (%)': `${r.etaCompliance}%`,
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">Admin</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <Link href="/admin/reports" className="text-xs text-slate-500 dark:text-zinc-400 font-semibold hover:underline">Reports</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Routes</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Route Network Corridor Analytics</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="ROUTE_CORRIDOR_ANALYTICS" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Configured Corridors</div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{data.totalRoutes}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Active origin-destination routes</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Active Operational Routes</div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">{data.activeRoutes}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Live operational corridors</div>
        </div>
      </div>

      {/* Route Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200">
          Route Corridor Financial & Performance Matrix
        </div>
        {data.routeStats.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">Route Code</th>
                  <th className="p-4">Corridor</th>
                  <th className="p-4">Distance & ETA</th>
                  <th className="p-4">Dispatches</th>
                  <th className="p-4">ETA On-Time %</th>
                  <th className="p-4 text-right">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {data.routeStats.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{r.routeCode}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{r.corridor}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{r.distanceKm} km ({r.etaHours}h)</td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{r.totalDispatches} trips</td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{r.etaCompliance}%</td>
                    <td className="p-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">₹{r.totalRevenue.toLocaleString('en-IN')}</td>
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
