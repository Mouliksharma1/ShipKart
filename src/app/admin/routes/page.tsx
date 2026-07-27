import React from 'react';
import { getRoutesAction } from '@/app/actions/admin/routes';
import { MapPin, Clock, ArrowRightLeft, Plus, AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminRoutesPage() {
  const res = await getRoutesAction({ includeArchived: true });
  const routes = res.routes || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-orange-600 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">Routes</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Route Network & Status Management</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/routes/new"
            className="flex items-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Configure Route
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Route Code</th>
                <th className="p-4">Origin Branch</th>
                <th className="p-4">Destination Branch</th>
                <th className="p-4">Distance & ETA</th>
                <th className="p-4">Type & Pricing</th>
                <th className="p-4">Route Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {routes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">
                    {r.routeCode || 'R-AUTO'}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900">{r.originOffice.name}</div>
                    <div className="text-[11px] text-slate-400">{r.originOffice.city}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-900">{r.destinationOffice.name}</div>
                    <div className="text-[11px] text-slate-400">{r.destinationOffice.city}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-800">{r.distanceKm} km</div>
                    <div className="text-[11px] text-slate-400">{r.etaHours} hrs ({r.departureTime || '8 PM'})</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-1 font-semibold text-slate-700">
                      {r.isBidirectional && <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500 mr-1" />}
                      <span>{r.isBidirectional ? 'Bidirectional' : 'One-Way'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{r.pricingGroup?.name || 'Standard Tariff'}</div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        r.routeStatus === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.routeStatus === 'SUSPENDED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.routeStatus}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <Link href={`/admin/routes/${r.id}`} className="font-bold text-orange-600 hover:text-orange-700">
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
