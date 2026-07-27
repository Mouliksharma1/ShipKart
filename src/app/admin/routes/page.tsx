import React from 'react';
import { getRoutesAction } from '@/app/actions/admin/routes';
import { MapPin, Clock, ArrowRightLeft, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminRoutesPage() {
  const res = await getRoutesAction({ includeArchived: true });
  const routes = res.routes || [];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Routes</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Route Network & Status Management</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/routes/new"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Configure Route
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                <th className="p-4">Route Code</th>
                <th className="p-4">Origin Branch</th>
                <th className="p-4">Destination Branch</th>
                <th className="p-4">Distance & ETA</th>
                <th className="p-4">Type & Pricing</th>
                <th className="p-4">Route Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium text-slate-700 dark:text-zinc-300">
              {routes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    {r.routeCode || 'R-AUTO'}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{r.originOffice.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500">{r.originOffice.city}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{r.destinationOffice.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500">{r.destinationOffice.city}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-zinc-200">{r.distanceKm} km</div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500">{r.etaHours} hrs ({r.departureTime || '8 PM'})</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-zinc-300">
                      {r.isBidirectional && <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500 mr-1" />}
                      <span>{r.isBidirectional ? 'Bidirectional' : 'One-Way'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-zinc-500">{r.pricingGroup?.name || 'Standard Tariff'}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        r.routeStatus === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                          : r.routeStatus === 'SUSPENDED'
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
                      }`}
                    >
                      {r.routeStatus}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <Link href={`/admin/routes/${r.id}`} className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
                      Edit Route &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
