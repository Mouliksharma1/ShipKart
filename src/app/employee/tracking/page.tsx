import React from "react";
import { getTrackingMetricsAction, getActivityFeedAction, getPendingCollectionsAction } from "@/app/actions/tracking";
import { LRScannerWidget } from "@/components/tracking/LRScannerWidget";
import { ActivityFeed } from "@/components/tracking/ActivityFeed";
import { StatusBadge } from "@/components/tracking/StatusBadge";
import Link from "next/link";
import { Package, Truck, Clock, CheckCircle2, AlertTriangle, ArrowRight, Activity, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Employee Logistics & Tracking Dashboard | Pooja Travels & Cargo",
  description: "Manage real-time parcel status updates, bus loading, and dispatches.",
};

export default async function EmployeeTrackingDashboardPage() {
  const [metricsRes, feedRes, pendingRes] = await Promise.all([
    getTrackingMetricsAction(),
    getActivityFeedAction(),
    getPendingCollectionsAction(),
  ]);

  const m = metricsRes.data || {
    todayBookingsCount: 0,
    inTransitCount: 0,
    pendingCollectionCount: 0,
    completedTodayCount: 0,
    delayedCount: 0,
    holdCount: 0,
  };

  const feed = feedRes.data || [];
  const pendingParcels = pendingRes.data || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
          <div>
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              LOGISTICS ENGINE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
              Employee Parcel Logistics & Status Management
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-neutral-400">
              Real-time consignment scanning, status transitions, and audit activity stream.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/employee/book"
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Counter LR</span>
            </Link>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-neutral-400">Today's Bookings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{m.todayBookingsCount}</div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">In Transit</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{m.inTransitCount}</div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Pending Collection</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{m.pendingCollectionCount}</div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed Today</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{m.completedTodayCount}</div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">Delayed</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{m.delayedCount}</div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1 shadow-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-500">On Hold</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-500">{m.holdCount}</div>
          </div>
        </div>

        {/* SCAN & UPDATE WIDGET */}
        <LRScannerWidget />

        {/* ACTIVE PARCELS PENDING ACTION & ACTIVITY FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PENDING ACTION PARCELS TABLE */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-neutral-800 pb-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                Parcels Requiring Counter Action ({pendingParcels.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase font-black text-[10px] tracking-wider">
                    <th className="py-3 px-3">LR Number</th>
                    <th className="py-3 px-3">Route</th>
                    <th className="py-3 px-3">Receiver</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-slate-700 dark:text-neutral-300 font-medium">
                  {pendingParcels.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-neutral-500">
                        No pending collection parcels at counter.
                      </td>
                    </tr>
                  ) : (
                    pendingParcels.map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-neutral-950/60 transition-colors">
                        <td className="py-3 px-3 font-mono font-black text-amber-600 dark:text-amber-400">
                          {b.lrNumber}
                        </td>
                        <td className="py-3 px-3">
                          {b.originOffice?.name} → {b.destinationOffice?.name}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-900 dark:text-white">{b.receiverName}</p>
                          <p className="text-[10px] font-mono text-slate-400">{b.receiverPhone}</p>
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={b.status} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/track/${b.lrNumber}`}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-amber-950 font-black text-[11px] whitespace-nowrap transition-all"
                          >
                            Track / Update
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* LIVE AUDIT STREAM */}
          <div className="lg:col-span-5">
            <ActivityFeed events={feed} />
          </div>
        </div>
      </div>
    </main>
  );
}
