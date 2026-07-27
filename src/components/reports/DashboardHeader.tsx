'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, ChevronLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  lastUpdated?: string;
  backHref?: string;
  backLabel?: string;
  tag?: string;
}

export function DashboardHeader({ title, subtitle, onRefresh, lastUpdated, backHref = '/admin/reports', backLabel = 'Reports Hub', tag }: DashboardHeaderProps) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (onRefresh) onRefresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, onRefresh]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 dark:from-neutral-950 dark:via-zinc-950 dark:to-neutral-950 rounded-3xl border border-zinc-800/60 shadow-xl mb-8">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-orange-600/6 rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-6 lg:p-8">
        {/* Top bar: back link + controls */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {backLabel}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all ${
                autoRefresh
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-white/5 text-zinc-500 border-zinc-700/60 hover:bg-white/10'
              }`}
            >
              <Clock className="w-3 h-3" />
              Auto {autoRefresh ? `${countdown}s` : 'OFF'}
            </button>

            {onRefresh && (
              <button
                onClick={() => { setCountdown(60); onRefresh(); }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 text-[11px] font-extrabold rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            )}
          </div>
        </div>

        {/* Title block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-[9px] font-extrabold uppercase tracking-widest text-amber-400">
              <Sparkles className="w-2.5 h-2.5" />
              {tag ?? 'Analytics'}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Live</span>
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="text-[11px] text-zinc-600 mt-1">Last updated: {lastUpdated}</p>
          )}
        </div>
      </div>
    </div>
  );
}
