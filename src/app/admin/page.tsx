import React from "react";
import Link from "next/link";
import { getOfficesAction, getRoutesAction } from "@/app/actions/offices-routes";
import { ShieldAlert, Building2, Route as RouteIcon, ArrowRight, CheckCircle2, MapPin, DollarSign, Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const officesRes = await getOfficesAction();
  const routesRes = await getRoutesAction();

  const offices = officesRes.data || [];
  const routes = routesRes.data || [];

  const activeOffices = offices.filter(o => o.status).length;
  const activeRoutes = routes.filter(r => r.status).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-white via-amber-500/5 to-slate-50 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950 p-5 sm:p-6 shadow-xl shadow-amber-500/5">
        {/* Subtle Ambient Radial Background Glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/30 dark:border-amber-400/30 backdrop-blur-md">
            <ShieldAlert className="h-3 w-3 stroke-[2.5]" />
            <span>Admin Command Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Ship<span className="text-amber-500">Kart</span> Master Control Center
          </h1>

          <p className="text-xs font-medium text-slate-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
            Configure station office networks, transport route pairings, tariff pricing groups, employee access, and live audit logs across the cargo logistics pipeline.
          </p>
        </div>
      </div>

      {/* Quick Office & Route Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Offices</span>
            <Building2 className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{offices.length}</p>
          <span className="text-[11px] text-green-600 dark:text-green-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{activeOffices} Active Station Offices</span>
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 space-y-2 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Routes</span>
            <RouteIcon className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{routes.length}</p>
          <span className="text-[11px] text-green-600 dark:text-green-400 font-semibold flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{activeRoutes} Active Transport Routes</span>
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 space-y-2 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">Rajasthan Offices</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {offices.filter(o => o.state === "Rajasthan").length}
          </p>
          <span className="text-[11px] text-slate-400">Head Office & Rajasthan Branches</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 space-y-2 shadow-md">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">Outside Rajasthan</span>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {offices.filter(o => o.state !== "Rajasthan").length}
          </p>
          <span className="text-[11px] text-slate-400">Delhi, UP, MP, Gujarat Branches</span>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/offices"
          className="group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg hover:border-amber-500 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Office Master
              </h3>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            Create, edit, search, and enable/disable branch offices. Set geo-coordinates, helpline contacts, and working hours.
          </p>
        </Link>

        <Link
          href="/admin/routes"
          className="group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg hover:border-amber-500 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RouteIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Route Master
              </h3>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            Configure origin to destination pairings, distance (KM), ETA hours, departure/arrival schedules, and status.
          </p>
        </Link>

        <Link
          href="/admin/pricing"
          className="group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg hover:border-amber-500 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Pricing Engine
              </h3>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            Manage normalized tariff groups, itemized parcel rules, taxi surcharges, and live price calculation sandbox.
          </p>
        </Link>

        <Link
          href="/admin/notifications"
          className="group rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-lg hover:border-amber-500 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Notifications
              </h3>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            Monitor real-time WhatsApp/SMS/Email queue, multi-language templates, system broadcasts, and Mailpit provider matrix.
          </p>
        </Link>
      </div>
    </div>
  );
}
