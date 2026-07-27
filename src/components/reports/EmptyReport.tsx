'use client';

import React from 'react';
import { FileQuestion, RefreshCw } from 'lucide-react';

interface EmptyReportProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyReport({
  title = 'No Data Found',
  description = 'No operational analytics records match the selected date or branch filters.',
  onReset,
}: EmptyReportProps) {
  return (
    <div className="p-10 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl text-center space-y-4 shadow-xs">
      <div className="w-12 h-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
        <FileQuestion className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">{description}</p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reset Filters
        </button>
      )}
    </div>
  );
}
