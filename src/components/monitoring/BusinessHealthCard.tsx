'use client';

import React from 'react';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

interface BusinessHealthCardProps {
  score: number;
  rating: string;
  breakdown?: Record<string, number>;
}

export const BusinessHealthCard: React.FC<BusinessHealthCardProps> = ({ score, rating, breakdown }) => {
  const getRatingColor = (r: string) => {
    switch (r.toLowerCase()) {
      case 'excellent': return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'good': return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'warning': return 'text-orange-700 dark:text-orange-400 bg-orange-500/10 border-orange-500/30';
      default: return 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Business Health Index</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">Real-time enterprise operational health</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${getRatingColor(rating)}`}>
          {rating}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
        <div className="relative w-28 h-28 flex flex-col items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-950/80 border-4 border-amber-500/40 shadow-inner shrink-0">
          <span className="text-3xl font-black text-slate-900 dark:text-white">{score}</span>
          <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Out of 100</span>
        </div>

        {breakdown && (
          <div className="flex-1 grid grid-cols-2 gap-2 text-xs w-full">
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 dark:text-zinc-400 block font-semibold text-[10px] uppercase">SLA Compliance</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{breakdown.slaCompliance}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 dark:text-zinc-400 block font-semibold text-[10px] uppercase">Delay Score</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{breakdown.delayRateScore}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 dark:text-zinc-400 block font-semibold text-[10px] uppercase">Fleet Util.</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{breakdown.vehicleUtilization}%</span>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950/50 p-2.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800">
              <span className="text-slate-500 dark:text-zinc-400 block font-semibold text-[10px] uppercase">Office Efficiency</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">{breakdown.officeEfficiency}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

