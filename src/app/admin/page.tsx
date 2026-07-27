import React from 'react';
import { getDashboardStatsAction } from '@/app/actions/admin/dashboard';
import { StatCard } from '@/components/admin/StatCard';
import { GlobalSearch } from '@/components/admin/GlobalSearch';
import {
  Package,
  TrendingUp,
  Truck,
  AlertTriangle,
  Clock,
  Building,
  Users,
  Bell,
  ShieldCheck,
  Wrench,
  ChevronRight,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStatsAction();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30">
              POOJA TRAVELS & CARGO
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-400 font-medium">Enterprise Administration ERP</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Operational Control Center</h1>
        </div>
        <div className="flex items-center space-x-4">
          <GlobalSearch />
        </div>
      </div>

      {/* Alert Banner if any expiries or delayed items */}
      {(stats.upcomingExpiriesAlerts > 0 || stats.delayedBookings > 0 || stats.notificationQueuePending > 10) && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-amber-900 dark:text-amber-200 text-xs font-semibold">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span>Attention required: </span>
              {stats.upcomingExpiriesAlerts > 0 && <span className="underline mr-2">{stats.upcomingExpiriesAlerts} vehicle document expiries</span>}
              {stats.delayedBookings > 0 && <span className="underline mr-2">{stats.delayedBookings} delayed parcels</span>}
              {stats.notificationQueuePending > 10 && <span className="underline">{stats.notificationQueuePending} queued notifications</span>}
            </div>
          </div>
          <Link href="/admin/vehicles" className="flex items-center text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold">
            Review Alerts <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}

      {/* BI Reports & Analytics Hub Callout */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 p-6 rounded-3xl text-amber-950 dark:text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 backdrop-blur-md">
              NEW BI MODULE
            </span>
            <span className="text-xs font-semibold opacity-90">Enterprise Analytics & Intelligence</span>
          </div>
          <h2 className="text-xl font-extrabold">Business Intelligence & Operational Reports</h2>
          <p className="text-xs opacity-90">Generate real-time revenue reports, branch comparisons, customer analytics, and CSV exports.</p>
        </div>
        <Link
          href="/admin/reports"
          className="flex items-center justify-center px-5 py-3 bg-white text-slate-900 font-extrabold rounded-2xl text-xs shadow-sm hover:bg-slate-100 transition-all shrink-0"
        >
          Open BI Reports Hub <ChevronRight className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`}
          subtitle={`Month: ₹${stats.monthRevenue.toLocaleString('en-IN')}`}
          variant="amber"
          icon={<TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
        <StatCard
          title="Today's Bookings"
          value={stats.todayBookings}
          subtitle={`${stats.pendingCollections} pending collection`}
          variant="default"
          icon={<Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        />
        <StatCard
          title="Active Dispatches"
          value={stats.dispatchesRunning}
          subtitle={`${stats.runningVehicles} vehicles on route`}
          variant="emerald"
          icon={<Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        />
        <StatCard
          title="Maintenance & Expiries"
          value={stats.maintenanceVehicles}
          subtitle={`${stats.upcomingExpiriesAlerts} expiries within 30 days`}
          variant="rose"
          icon={<Wrench className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
        />
      </div>

      {/* Operational Utilization Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Active Offices</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.activeOffices} Network Branches</div>
            </div>
          </div>
          <Link href="/admin/offices" className="p-2 text-slate-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Employee Attendance</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.employeesPresentToday} / {stats.activeEmployees} Present</div>
            </div>
          </div>
          <Link href="/admin/employees" className="p-2 text-slate-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Notification Engine</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{stats.notificationQueuePending} Messages Queued</div>
            </div>
          </div>
          <Link href="/admin/notifications" className="p-2 text-slate-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Offices', href: '/admin/offices', icon: Building, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          { label: 'Employees', href: '/admin/employees', icon: Users, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
          { label: 'Vehicles', href: '/admin/vehicles', icon: Truck, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          { label: 'Routes', href: '/admin/routes', icon: Clock, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
          { label: 'Pricing', href: '/admin/pricing', icon: TrendingUp, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          { label: 'Settings', href: '/admin/settings', icon: ShieldCheck, color: 'bg-zinc-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300' },
          { label: 'Audit Trail', href: '/admin/activity', icon: Activity, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
        ].map((mod) => (
          <Link
            key={mod.label}
            href={mod.href}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-500/80 hover:shadow-md transition-all text-center group"
          >
            <div className={`p-3 rounded-xl ${mod.color} mb-2 group-hover:scale-110 transition-transform`}>
              <mod.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">{mod.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity Log Feed */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Enterprise Audit Feed</h2>
          </div>
          <Link href="/admin/activity" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center">
            View All Logs <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentActivities.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-zinc-500 py-4 text-center">No recent activity recorded.</p>
          ) : (
            stats.recentActivities.map((act) => (
              <div key={act.id} className="flex items-start justify-between p-3.5 bg-slate-50/70 dark:bg-zinc-800/40 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">{act.action}</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      Module: <span className="font-semibold text-slate-700 dark:text-zinc-300">{act.module}</span> | User: {act.user?.name || 'System'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                  {new Date(act.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
