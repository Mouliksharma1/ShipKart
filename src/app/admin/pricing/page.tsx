import React from 'react';
import { getPricingVersionsAction } from '@/app/actions/admin/pricing';
import { TrendingUp, ShieldCheck, Lock, CheckCircle2, Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  const res = await getPricingVersionsAction();
  const versions = res.versions || [];
  const active = res.active;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-orange-600 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-500 font-semibold">Pricing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Tariff & Pricing Version Lock Manager</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pricing/new"
            className="flex items-center px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Pricing Version
          </Link>
        </div>
      </div>

      {active && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold tracking-wider uppercase">
              CURRENTLY ACTIVE SYSTEM TARIFF
            </span>
            <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded-full">{active.pricingCode}</span>
          </div>
          <h2 className="text-2xl font-black">{active.name} (Version {active.version})</h2>
          <p className="text-xs text-orange-100">{active.description || 'System-wide active freight & tariff rate matrix'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs border-t border-white/20">
            {active.pricingRules.map((r) => (
              <div key={r.id} className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
                <div className="font-extrabold uppercase text-[10px] text-orange-200">{r.parcelType}</div>
                <div className="text-lg font-black mt-0.5">₹{r.selfPrice}</div>
                <div className="text-[10px] text-orange-100">Taxi: {r.taxiPrice ? `+₹${r.taxiPrice}` : 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-sm text-slate-800">
          Tariff Version History & Archival Lock
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4">Version</th>
                <th className="p-4">Pricing Code & Name</th>
                <th className="p-4">Effective Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {versions.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 font-mono text-sm">
                    v{v.version}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">{v.pricingCode || 'P-AUTO'}</div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {v.effectiveFrom ? new Date(v.effectiveFrom).toLocaleDateString('en-IN') : 'Immediate'}
                    {v.effectiveTill ? ` to ${new Date(v.effectiveTill).toLocaleDateString('en-IN')}` : ' onwards'}
                  </td>
                  <td className="p-4">
                    {v.status ? (
                      <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ACTIVE VERSION
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
                        <Lock className="w-3.5 h-3.5 mr-1" /> ARCHIVED / DRAFT
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/pricing/${v.id}`} className="font-bold text-orange-600 hover:text-orange-700">
                      View Version &rarr;
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
