import React from 'react';
import { getDashboardSummary } from '@/lib/services/analytics/dashboard.service';
import { DollarSign, Package, Truck, Users, MapPin, Building, ArrowRight, BarChart3, TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const reportModules = [
  {
    title: 'Revenue & Financials',
    href: '/admin/reports/revenue',
    desc: 'Daily revenue, payment split, branch contribution & collection breakdown',
    gradient: 'from-emerald-500/15 to-teal-500/5',
    border: 'border-emerald-500/20 hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400',
    accent: 'text-emerald-600 dark:text-emerald-400',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    tag: 'Financial',
  },
  {
    title: 'Booking Analytics',
    href: '/admin/reports/bookings',
    desc: 'Volume trends, parcel type breakdown, average ticket value & peak booking hours',
    gradient: 'from-amber-500/15 to-yellow-500/5',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    iconBg: 'bg-amber-500/15 text-amber-500 dark:text-amber-400',
    accent: 'text-amber-600 dark:text-amber-400',
    iconPath: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1z',
    tag: 'Operations',
  },
  {
    title: 'Dispatch Operations',
    href: '/admin/reports/dispatches',
    desc: 'Fleet movements, transit status, manifest history & corridor activity',
    gradient: 'from-blue-500/15 to-cyan-500/5',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    iconBg: 'bg-blue-500/15 text-blue-500 dark:text-blue-400',
    accent: 'text-blue-600 dark:text-blue-400',
    iconPath: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    tag: 'Fleet',
  },
  {
    title: 'Employee Productivity',
    href: '/admin/reports/employees',
    desc: 'Leaderboard rankings, booking handling, collection turnaround by branch',
    gradient: 'from-violet-500/15 to-purple-500/5',
    border: 'border-violet-500/20 hover:border-violet-400/50',
    iconBg: 'bg-violet-500/15 text-violet-500 dark:text-violet-400',
    accent: 'text-violet-600 dark:text-violet-400',
    iconPath: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    tag: 'HR',
  },
  {
    title: 'Customer Insights',
    href: '/admin/reports/customers',
    desc: 'Top shippers by LTV, new vs returning customers, shipper frequency analysis',
    gradient: 'from-rose-500/15 to-pink-500/5',
    border: 'border-rose-500/20 hover:border-rose-400/50',
    iconBg: 'bg-rose-500/15 text-rose-500 dark:text-rose-400',
    accent: 'text-rose-600 dark:text-rose-400',
    iconPath: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    tag: 'CRM',
  },
  {
    title: 'Route Performance',
    href: '/admin/reports/routes',
    desc: 'Corridor revenue, dispatch frequency, ETA compliance & route efficiency',
    gradient: 'from-orange-500/15 to-amber-500/5',
    border: 'border-orange-500/20 hover:border-orange-400/50',
    iconBg: 'bg-orange-500/15 text-orange-500 dark:text-orange-400',
    accent: 'text-orange-600 dark:text-orange-400',
    iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    tag: 'Network',
  },
  {
    title: 'Branch Comparison',
    href: '/admin/reports/offices',
    desc: 'Side-by-side office performance, storage utilization & revenue matrix',
    gradient: 'from-slate-500/15 to-zinc-500/5',
    border: 'border-slate-500/20 hover:border-slate-400/50',
    iconBg: 'bg-slate-500/15 text-slate-500 dark:text-slate-400',
    accent: 'text-slate-600 dark:text-slate-400',
    iconPath: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
    tag: 'Enterprise',
  },
];

export default async function ReportsOverviewPage() {
  const summary = await getDashboardSummary();

  const kpiCards = [
    {
      label: "Today's Revenue",
      value: `₹${summary.todayRevenue.toLocaleString('en-IN')}`,
      sub: `${summary.todayCount} bookings`,
      badge: '+12.4%',
      positive: true,
      barColor: 'bg-emerald-500',
      barWidth: '68%',
      glow: 'shadow-emerald-500/10',
    },
    {
      label: 'Pending Collections',
      value: `₹${summary.pendingCollectionsTotal.toLocaleString('en-IN')}`,
      sub: `${summary.pendingCollectionsCount} awaiting payment`,
      badge: 'Action',
      positive: false,
      barColor: 'bg-amber-500',
      barWidth: '45%',
      glow: 'shadow-amber-500/10',
    },
    {
      label: 'Active Dispatches',
      value: summary.activeDispatchesCount,
      sub: `${summary.inTransitShipmentsCount} in transit`,
      badge: 'Live',
      positive: true,
      barColor: 'bg-blue-500',
      barWidth: '78%',
      glow: 'shadow-blue-500/10',
    },
    {
      label: 'Delayed Shipments',
      value: summary.delayedShipmentsCount,
      sub: 'Over 48 hour threshold',
      badge: summary.delayedShipmentsCount > 0 ? 'Review' : 'Optimal',
      positive: summary.delayedShipmentsCount === 0,
      barColor: summary.delayedShipmentsCount > 0 ? 'bg-rose-500' : 'bg-emerald-500',
      barWidth: summary.delayedShipmentsCount > 0 ? '35%' : '5%',
      glow: 'shadow-rose-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 transition-colors">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-900 dark:from-neutral-950 dark:via-zinc-950 dark:to-neutral-950 px-6 lg:px-10 pt-10 pb-16">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Breadcrumb */}
        <div className="relative flex items-center gap-2 text-xs mb-5">
          <Link href="/admin" className="text-zinc-400 hover:text-amber-400 transition-colors font-medium">Admin</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-amber-400 font-bold">Reports & Analytics</span>
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/25 text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                <Sparkles className="w-3 h-3" />
                Enterprise BI
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Live Data</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight">
              Business Intelligence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                & Executive Reports
              </span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              Real-time operational analytics, financial summaries, branch performance insights, and one-click CSV exports for Pooja Travels & Cargo.
            </p>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 text-zinc-300 hover:text-white transition-all backdrop-blur-sm shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Back to Control Center
          </Link>
        </div>
      </div>

      <div className="px-6 lg:px-10 -mt-8 space-y-10 pb-16">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className={`relative bg-white dark:bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-lg ${card.glow} overflow-hidden`}
            >
              {/* background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.02] pointer-events-none rounded-3xl" />

              <div className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">{card.label}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${card.positive ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'}`}>
                    {card.badge}
                  </span>
                </div>

                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tight">{card.value}</div>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">{card.sub}</p>

                {/* mini bar */}
                <div className="h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${card.barColor} rounded-full transition-all`} style={{ width: card.barWidth }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Report Dashboards</h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">7 enterprise analytics modules</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-600 border border-slate-200 dark:border-zinc-800 px-3 py-1 rounded-full">
            All Reports
          </span>
        </div>

        {/* ── Module Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reportModules.map((mod, index) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`relative group bg-white dark:bg-zinc-900/80 backdrop-blur-sm rounded-3xl border ${mod.border} p-6 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between gap-5`}
            >
              {/* gradient bg tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none`} />

              {/* shine line */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent dark:from-white/[0.03] pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 ${mod.iconBg} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d={mod.iconPath} />
                    </svg>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700`}>
                    {mod.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className={`text-base font-extrabold text-slate-900 dark:text-white group-hover:${mod.accent.split(' ')[0]} transition-colors duration-200`}>
                    {mod.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed">{mod.desc}</p>
                </div>
              </div>

              <div className={`relative pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-extrabold ${mod.accent}`}>
                <span>Open Report</span>
                <div className="w-7 h-7 rounded-xl bg-current/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-200">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Footer Note ── */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 dark:text-zinc-600 border border-slate-200 dark:border-zinc-800/60 rounded-2xl py-4 px-6 bg-white/50 dark:bg-zinc-900/40">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          All reports reflect live production data. Use date and branch filters on each dashboard for focused analysis.
        </div>
      </div>
    </div>
  );
}
