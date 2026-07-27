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
    default: 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100',
    orange: 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-zinc-900 border-amber-200/80 dark:border-amber-500/20 text-slate-900 dark:text-amber-200',
    emerald: 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-zinc-900 border-emerald-200/80 dark:border-emerald-500/20 text-slate-900 dark:text-emerald-200',
    amber: 'bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-950/30 dark:to-zinc-900 border-amber-200/80 dark:border-amber-500/20 text-slate-900 dark:text-amber-200',
    rose: 'bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-950/30 dark:to-zinc-900 border-rose-200/80 dark:border-rose-500/20 text-slate-900 dark:text-rose-200',
    indigo: 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-zinc-900 border-amber-200/80 dark:border-amber-500/20 text-slate-900 dark:text-amber-200',
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-xs transition-all duration-200 hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-white/80 dark:bg-zinc-800/80 shadow-xs text-slate-700 dark:text-zinc-200">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
        {trend && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">{subtitle}</p>}
    </div>
  );
}
