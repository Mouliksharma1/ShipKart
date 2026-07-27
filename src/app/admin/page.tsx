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
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
              POOJA TRAVELS & CARGO
            </span>
            <span className="text-xs text-slate-400">Enterprise Administration ERP</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Operational Control Center</h1>
        </div>
        <div className="flex items-center space-x-4">
          <GlobalSearch />
        </div>
      </div>

      {/* Alert Banner if any expiries or delayed items */}
      {(stats.upcomingExpiriesAlerts > 0 || stats.delayedBookings > 0 || stats.notificationQueuePending > 10) && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-amber-900 text-xs font-semibold">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span>Attention required: </span>
              {stats.upcomingExpiriesAlerts > 0 && <span className="underline mr-2">{stats.upcomingExpiriesAlerts} vehicle document expiries</span>}
              {stats.delayedBookings > 0 && <span className="underline mr-2">{stats.delayedBookings} delayed parcels</span>}
              {stats.notificationQueuePending > 10 && <span className="underline">{stats.notificationQueuePending} queued notifications</span>}
            </div>
          </div>
          <Link href="/admin/vehicles" className="flex items-center text-amber-700 hover:text-amber-900 font-bold">
            Review Alerts <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toLocaleString('en-IN')}`}
          subtitle={`Month: ₹${stats.monthRevenue.toLocaleString('en-IN')}`}
          variant="orange"
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
        />
        <StatCard
          title="Today's Bookings"
          value={stats.todayBookings}
          subtitle={`${stats.pendingCollections} pending collection`}
          variant="indigo"
          icon={<Package className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          title="Active Dispatches"
          value={stats.dispatchesRunning}
          subtitle={`${stats.runningVehicles} vehicles on route`}
          variant="emerald"
          icon={<Truck className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title="Maintenance & Expiries"
          value={stats.maintenanceVehicles}
          subtitle={`${stats.upcomingExpiriesAlerts} expiries within 30 days`}
          variant="amber"
          icon={<Wrench className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Operational Utilization Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Active Offices</div>
              <div className="text-xl font-bold text-slate-900">{stats.activeOffices} Network Branches</div>
            </div>
          </div>
          <Link href="/admin/offices" className="p-2 text-slate-400 hover:text-slate-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Employee Attendance</div>
              <div className="text-xl font-bold text-slate-900">{stats.employeesPresentToday} / {stats.activeEmployees} Present</div>
            </div>
          </div>
          <Link href="/admin/employees" className="p-2 text-slate-400 hover:text-slate-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Notification Engine</div>
              <div className="text-xl font-bold text-slate-900">{stats.notificationQueuePending} Messages Queued</div>
            </div>
          </div>
          <Link href="/admin/notifications" className="p-2 text-slate-400 hover:text-slate-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Offices', href: '/admin/offices', icon: Building, color: 'bg-purple-100 text-purple-700' },
          { label: 'Employees', href: '/admin/employees', icon: Users, color: 'bg-emerald-100 text-emerald-700' },
          { label: 'Vehicles', href: '/admin/vehicles', icon: Truck, color: 'bg-amber-100 text-amber-700' },
          { label: 'Routes', href: '/admin/routes', icon: Clock, color: 'bg-rose-100 text-rose-700' },
          { label: 'Pricing', href: '/admin/pricing', icon: TrendingUp, color: 'bg-blue-100 text-blue-700' },
          { label: 'Settings', href: '/admin/settings', icon: ShieldCheck, color: 'bg-slate-100 text-slate-700' },
          { label: 'Audit Trail', href: '/admin/activity', icon: Activity, color: 'bg-orange-100 text-orange-700' },
        ].map((mod) => (
          <Link
            key={mod.label}
            href={mod.href}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all text-center group"
          >
            <div className={`p-3 rounded-xl ${mod.color} mb-2 group-hover:scale-110 transition-transform`}>
              <mod.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600">{mod.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity Log Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Recent Enterprise Audit Feed</h2>
          </div>
          <Link href="/admin/activity" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center">
            View All Logs <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentActivities.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No recent activity recorded.</p>
          ) : (
            stats.recentActivities.map((act) => (
              <div key={act.id} className="flex items-start justify-between p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{act.action}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Module: <span className="font-semibold text-slate-700">{act.module}</span> | User: {act.user?.name || 'System'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
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
