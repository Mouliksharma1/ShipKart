import React from 'react';
import { getDispatchAnalytics } from '@/lib/services/analytics/dispatch.service';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { Truck, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DispatchesReportPage() {
  const data = await getDispatchAnalytics();

  const exportHeaders = ['Dispatch Manifest No', 'Origin Branch', 'Destination Branch', 'Vehicle', 'Status'];
  const exportData = data.dispatches.map((d) => ({
    'Dispatch Manifest No': d.dispatchNumber || d.id,
    'Origin Branch': d.originOffice?.name || 'N/A',
    'Destination Branch': d.destinationOffice?.name || 'N/A',
    'Vehicle': d.vehicle?.vehicleNumber || 'Unassigned',
    'Status': d.status,
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Dispatches</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Dispatch & Fleet Operational Analytics</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="DISPATCH_ANALYTICS" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Dispatches</div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{data.totalDispatches}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Total freight vehicle trips</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Currently In-Transit</div>
          <div className="text-2xl font-mono font-black text-amber-600 dark:text-amber-400">{data.inTransitCount}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Live active corridor movements</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Completed Dispatches</div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">{data.completedCount}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Arrived & unloaded at destination</div>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200">
          Dispatch Manifests History ({data.dispatches.length})
        </div>
        {data.dispatches.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">Manifest Code</th>
                  <th className="p-4">Origin Branch</th>
                  <th className="p-4">Destination Branch</th>
                  <th className="p-4">Assigned Vehicle</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {data.dispatches.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{d.dispatchNumber || 'DISP-AUTO'}</td>
                    <td className="p-4 text-slate-700 dark:text-zinc-300">{d.originOffice?.name || 'N/A'}</td>
                    <td className="p-4 text-slate-700 dark:text-zinc-300">{d.destinationOffice?.name || 'N/A'}</td>
                    <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">{d.vehicle?.vehicleNumber || 'Unassigned'}</td>
                    <td className="p-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{d.status}</td>
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
