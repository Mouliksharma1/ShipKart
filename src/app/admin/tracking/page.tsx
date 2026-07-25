import React from "react";
import { getTrackingMetricsAction, getActivityFeedAction } from "@/app/actions/tracking";
import { searchBookingsAction } from "@/app/actions/employee-booking";
import { StatusBadge } from "@/components/tracking/StatusBadge";
import { ActivityFeed } from "@/components/tracking/ActivityFeed";
import Link from "next/link";
import { Shield, Package, Truck, Clock, AlertTriangle, FileSpreadsheet, Search, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Logistics & Tracking Command Center | Pooja Travels & Cargo",
  description: "Network-wide parcel tracking control, dispatches, delays, and audit logs.",
};

export default async function AdminTrackingPage() {
  const [metricsRes, feedRes, bookingsRes] = await Promise.all([
    getTrackingMetricsAction(),
    getActivityFeedAction(),
    searchBookingsAction({}),
  ]);

  const m = metricsRes.data || {
    todayBookingsCount: 0,
    inTransitCount: 0,
    pendingCollectionCount: 0,
    completedTodayCount: 0,
    delayedCount: 0,
    holdCount: 0,
    todayDispatchesCount: 0,
  };

  const feed = feedRes.data || [];
  const bookings = bookingsRes.data || [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              ADMINISTRATIVE COMMAND CENTER
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Network Logistics & Parcel Control
            </h1>
            <p className="text-xs text-slate-400">
              Full visibility across all dispatches, office nodes, delays, and immutable audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/employee/tracking"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              Employee Logistics Scanner
            </Link>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Today's Bookings</span>
            <div className="text-2xl font-black text-white">{m.todayBookingsCount}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-blue-400">Dispatches</span>
            <div className="text-2xl font-black text-blue-400">{m.todayDispatchesCount}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-400">In Transit</span>
            <div className="text-2xl font-black text-amber-400">{m.inTransitCount}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-purple-400">Ready at Counter</span>
            <div className="text-2xl font-black text-purple-400">{m.pendingCollectionCount}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Completed Today</span>
            <div className="text-2xl font-black text-emerald-400">{m.completedTodayCount}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-rose-400">Delayed</span>
            <div className="text-2xl font-black text-rose-400">{m.delayedCount}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-orange-400">On Hold</span>
            <div className="text-2xl font-black text-orange-400">{m.holdCount}</div>
          </div>
        </div>

        {/* LOGISTICS AUDIT FEED & RECENT CONSIGNMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ALL NETWORK CONSIGNMENTS TABLE */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                Network Consignments ({bookings.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-2.5 px-3">LR Number</th>
                    <th className="py-2.5 px-3">Sender / Receiver</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">View / Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {bookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-950/50">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {b.lrNumber}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-white">{b.senderName} ➔ {b.receiverName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{b.senderPhone}</p>
                      </td>
                      <td className="py-3 px-3">
                        {b.originOffice?.name} → {b.destinationOffice?.name}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <Link
                          href={`/track/${b.lrNumber}`}
                          className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 font-bold hover:bg-blue-600 hover:text-white transition"
                        >
                          Tracking Timeline
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AUDIT ACTIVITY FEED */}
          <div className="lg:col-span-5">
            <ActivityFeed events={feed} />
          </div>
        </div>
      </div>
    </main>
  );
}
