import React from 'react';
import { getDashboardSummary } from '@/lib/services/analytics/dashboard.service';
import { getOfficesAction } from '@/app/actions/admin/office';
import { AnalyticsCard } from '@/components/reports/AnalyticsCard';
import { DashboardHeader } from '@/components/reports/DashboardHeader';
import { DollarSign, Package, Truck, Users, MapPin, Building, ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReportsOverviewPage() {
  const summary = await getDashboardSummary();

  const reportModules = [
    { title: 'Revenue & Financials', href: '/admin/reports/revenue', icon: DollarSign, desc: 'Daily, monthly, payment split, and branch revenue' },
    { title: 'Booking Analytics', href: '/admin/reports/bookings', icon: Package, desc: 'Volume trends, parcel types, average values, peak hours' },
    { title: 'Dispatch Operations', href: '/admin/reports/dispatches', icon: Truck, desc: 'Vehicle capacity, transit times, delays, route load' },
    { title: 'Employee Productivity', href: '/admin/reports/employees', icon: Users, desc: 'Processing turnaround, collections, branch leaderboards' },
    { title: 'Customer Insights', href: '/admin/reports/customers', icon: Users, desc: 'Shipper frequency, top accounts, LTV estimates' },
    { title: 'Route Performance', href: '/admin/reports/routes', icon: MapPin, desc: 'Top corridors, ETA compliance, route revenue' },
    { title: 'Branch Comparison', href: '/admin/reports/offices', icon: Building, desc: 'Cross-office performance matrix and comparisons' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <DashboardHeader
        title="Business Intelligence & Executive Reports"
        subtitle="Real-time operational analytics, financial summary, and branch performance insights"
      />

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnalyticsCard
          title="Today's Revenue"
          value={`₹${summary.todayRevenue.toLocaleString('en-IN')}`}
          subtitle={`${summary.todayCount} bookings created today`}
          trend="+12.4%"
          isPositive={true}
          iconName="dollar"
        />
        <AnalyticsCard
          title="Pending Collections"
          value={`₹${summary.pendingCollectionsTotal.toLocaleString('en-IN')}`}
          subtitle={`${summary.pendingCollectionsCount} pending payments`}
          trend="Action Required"
          isPositive={false}
          iconName="package"
        />
        <AnalyticsCard
          title="Active Dispatches"
          value={summary.activeDispatchesCount}
          subtitle={`${summary.inTransitShipmentsCount} parcels in transit`}
          trend="Live Fleet"
          isPositive={true}
          iconName="truck"
        />
        <AnalyticsCard
          title="Delayed Shipments"
          value={summary.delayedShipmentsCount}
          subtitle="Shipments pending >48 hrs"
          trend={summary.delayedShipmentsCount > 0 ? 'Review' : 'Optimal'}
          isPositive={summary.delayedShipmentsCount === 0}
          iconName="chart"
        />
      </div>

      {/* Report Modules Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-amber-500" /> Enterprise Report Dashboards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportModules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4 hover:border-amber-500/50 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl w-fit group-hover:scale-105 transition-transform">
                  <mod.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{mod.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
