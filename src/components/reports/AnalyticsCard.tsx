'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, BarChart3, Building, Users, MapPin, Minus } from 'lucide-react';

export type IconType = 'dollar' | 'package' | 'truck' | 'chart' | 'building' | 'users' | 'route';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
  iconName?: IconType;
  barWidth?: string;
  accentColor?: 'amber' | 'emerald' | 'blue' | 'rose' | 'violet' | 'orange';
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

const accentMap: Record<string, { icon: string; bar: string; glow: string }> = {
  amber:   { icon: 'bg-amber-500/15 text-amber-500 dark:text-amber-400',   bar: 'bg-amber-500',   glow: 'shadow-amber-500/10' },
  emerald: { icon: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/10' },
  blue:    { icon: 'bg-blue-500/15 text-blue-500 dark:text-blue-400',      bar: 'bg-blue-500',    glow: 'shadow-blue-500/10' },
  rose:    { icon: 'bg-rose-500/15 text-rose-500 dark:text-rose-400',      bar: 'bg-rose-500',    glow: 'shadow-rose-500/10' },
  violet:  { icon: 'bg-violet-500/15 text-violet-500 dark:text-violet-400', bar: 'bg-violet-500', glow: 'shadow-violet-500/10' },
  orange:  { icon: 'bg-orange-500/15 text-orange-500 dark:text-orange-400', bar: 'bg-orange-500', glow: 'shadow-orange-500/10' },
};

export function AnalyticsCard({
  title, value, subtitle, trend, isPositive = true,
  iconName, barWidth, accentColor = 'amber',
}: AnalyticsCardProps) {
  const IconComponent = iconName ? iconMap[iconName] : null;
  const accent = accentMap[accentColor];

  return (
    <div className={`relative bg-white dark:bg-zinc-900/80 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-lg ${accent.glow} overflow-hidden group hover:scale-[1.01] transition-transform duration-200`}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.02] pointer-events-none rounded-3xl" />

      <div className="relative space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500 leading-tight">{title}</span>
          {IconComponent && (
            <div className={`p-2.5 ${accent.icon} rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Value + trend */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight leading-none">{value}</div>
          {trend && (
            <span className={`flex items-center gap-0.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
              isPositive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                : trend === 'Optimal' || trend === 'Live'
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
            }`}>
              {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {trend}
            </span>
          )}
        </div>

        {subtitle && <p className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">{subtitle}</p>}

        {/* Mini progress bar */}
        {barWidth && (
          <div className="h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${accent.bar} rounded-full`} style={{ width: barWidth }} />
          </div>
        )}
      </div>
    </div>
  );
}
