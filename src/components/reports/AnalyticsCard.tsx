'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, BarChart3, Building, Users, MapPin } from 'lucide-react';

export type IconType = 'dollar' | 'package' | 'truck' | 'chart' | 'building' | 'users' | 'route';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
  iconName?: IconType;
}

const iconMap: Record<IconType, React.ElementType> = {
  dollar: DollarSign,
  package: Package,
  truck: Truck,
  chart: BarChart3,
  building: Building,
  users: Users,
  route: MapPin,
};

export function AnalyticsCard({ title, value, subtitle, trend, isPositive = true, iconName }: AnalyticsCardProps) {
  const IconComponent = iconName ? iconMap[iconName] : null;

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">{title}</span>
        {IconComponent && (
          <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
            <IconComponent className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{value}</div>
        {trend && (
          <span
            className={`flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 dark:text-zinc-500">{subtitle}</p>}
    </div>
  );
}
