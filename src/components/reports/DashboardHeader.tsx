'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Filter } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function DashboardHeader({ title, subtitle, onRefresh, lastUpdated }: DashboardHeaderProps) {
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3 text-xs">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center px-3 py-1.5 rounded-xl font-bold border transition-colors ${
            autoRefresh
              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
              : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          Auto 60s {autoRefresh ? `(${countdown}s)` : 'OFF'}
        </button>

        {onRefresh && (
          <button
            onClick={() => {
              setCountdown(60);
              onRefresh();
            }}
            className="flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold rounded-xl transition-all shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Live Refresh
          </button>
        )}
      </div>
    </div>
  );
}
