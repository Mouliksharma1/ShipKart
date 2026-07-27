import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  variant?: 'default' | 'orange' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export function StatCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
    orange: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 border-orange-200/80 dark:border-orange-800/50 text-orange-950 dark:text-orange-200',
    emerald: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200/80 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200',
    amber: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 border-amber-200/80 dark:border-amber-800/50 text-amber-950 dark:text-amber-200',
    rose: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 border-rose-200/80 dark:border-rose-800/50 text-rose-950 dark:text-rose-200',
    indigo: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border-indigo-200/80 dark:border-indigo-800/50 text-indigo-950 dark:text-indigo-200',
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-xs transition-all duration-200 hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-xs text-slate-700 dark:text-slate-200">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
        {trend && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
