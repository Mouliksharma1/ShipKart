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
    default: 'bg-white border-slate-200 text-slate-900',
    orange: 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 text-orange-950',
    emerald: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950',
    amber: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 text-amber-950',
    rose: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 text-rose-950',
    indigo: 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 text-indigo-950',
  };

  return (
    <div className={`p-5 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-white/80 shadow-xs text-slate-700">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
        {trend && <span className="text-xs font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
