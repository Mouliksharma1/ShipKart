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
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Admin
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Pricing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Tariff & Pricing Version Lock Manager</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/pricing/new"
            className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Pricing Version
          </Link>
        </div>
      </div>

      {active && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 p-6 rounded-3xl text-amber-950 dark:text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold tracking-wider uppercase text-amber-950 dark:text-white">
              CURRENTLY ACTIVE SYSTEM TARIFF
            </span>
            <span className="text-xs font-mono bg-white/20 px-2.5 py-0.5 rounded-full text-amber-950 dark:text-white">{active.pricingCode}</span>
          </div>
          <h2 className="text-2xl font-black">{active.name} (Version {active.version})</h2>
          <p className="text-xs text-amber-900/90 dark:text-amber-100">{active.description || 'System-wide active freight & tariff rate matrix'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs border-t border-black/10 dark:border-white/20">
            {active.pricingRules.map((r) => (
              <div key={r.id} className="bg-white/20 dark:bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
                <div className="font-extrabold uppercase text-[10px] text-amber-950 dark:text-amber-200">{r.parcelType}</div>
                <div className="text-lg font-black mt-0.5">₹{r.selfPrice}</div>
                <div className="text-[10px] text-amber-900 dark:text-amber-100">Taxi: {r.taxiPrice ? `+₹${r.taxiPrice}` : 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version History Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200">
          Tariff Version History & Archival Lock
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">
                <th className="p-4">Version</th>
                <th className="p-4">Pricing Code & Name</th>
                <th className="p-4">Effective Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium text-slate-700 dark:text-zinc-300">
              {versions.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 dark:text-white font-mono text-sm">
                    v{v.version}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{v.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">{v.pricingCode || 'P-AUTO'}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-zinc-400">
                    {v.effectiveFrom ? new Date(v.effectiveFrom).toLocaleDateString('en-IN') : 'Immediate'}
                    {v.effectiveTill ? ` to ${new Date(v.effectiveTill).toLocaleDateString('en-IN')}` : ' onwards'}
                  </td>
                  <td className="p-4">
                    {v.status ? (
                      <span className="flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ACTIVE VERSION
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-semibold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-2.5 py-1 rounded-full w-fit">
                        <Lock className="w-3.5 h-3.5 mr-1" /> ARCHIVED / DRAFT
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/pricing/${v.id}`} className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
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
