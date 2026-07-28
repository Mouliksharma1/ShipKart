'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export const LiveStatusIndicator: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2.5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 px-3.5 py-2 rounded-2xl text-xs text-slate-700 dark:text-zinc-300 shadow-xs">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </span>
      <span className="font-bold text-slate-900 dark:text-white">Live Polling (30s)</span>
      <span className="text-slate-300 dark:text-zinc-700">|</span>
      <span className="text-slate-500 dark:text-zinc-400 font-medium flex items-center">
        <RefreshCw className="w-3 h-3 mr-1 text-slate-400 animate-spin" style={{ animationDuration: '6s' }} />
        {lastUpdated || 'Just now'}
      </span>
    </div>
  );
};

