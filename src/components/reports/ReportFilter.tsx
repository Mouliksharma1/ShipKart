'use client';

import React from 'react';
import { Filter, Calendar, Building } from 'lucide-react';

interface ReportFilterProps {
  offices?: Array<{ id: string; name: string }>;
  selectedOffice?: string;
  onOfficeChange?: (officeId: string) => void;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export function ReportFilter({
  offices = [],
  selectedOffice = '',
  onOfficeChange,
  dateRange = '7d',
  onDateRangeChange,
}: ReportFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl text-xs shadow-xs">
      <div className="flex items-center space-x-1.5 font-bold text-slate-700 dark:text-zinc-300 mr-2">
        <Filter className="w-4 h-4 text-amber-500" />
        <span>Filters:</span>
      </div>

      {/* Date Range Selector */}
      {onDateRangeChange && (
        <div className="flex items-center bg-slate-50 dark:bg-zinc-800/40 p-1 border border-slate-200 dark:border-zinc-800 rounded-xl">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onDateRangeChange(item.id)}
              className={`px-3 py-1.5 rounded-lg font-extrabold transition-colors ${
                dateRange === item.id
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Office Dropdown */}
      {onOfficeChange && offices.length > 0 && (
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-zinc-800/40 px-3 py-1.5 border border-slate-200 dark:border-zinc-800 rounded-xl">
          <Building className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
          <select
            value={selectedOffice}
            onChange={(e) => onOfficeChange(e.target.value)}
            className="bg-transparent font-bold text-slate-800 dark:text-zinc-200 focus:outline-hidden"
          >
            <option value="">All Branch Offices</option>
            {offices.map((off) => (
              <option key={off.id} value={off.id}>
                {off.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
