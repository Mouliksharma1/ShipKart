import React from "react";
import { getPendingCollectionsAction, getTrackingMetricsAction } from "@/app/actions/tracking";
import { StatusBadge } from "@/components/tracking/StatusBadge";
import Link from "next/link";
import { Building2, Package, CheckCircle2, ShieldCheck, Clock, Search, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Partner Office Dashboard | Pooja Travels & Cargo",
  description: "Manage incoming dispatches, parcel arrivals, and counter receiver verification.",
};

export default async function PartnerDashboardPage() {
  const [pendingRes, metricsRes] = await Promise.all([
    getPendingCollectionsAction(),
    getTrackingMetricsAction(),
  ]);

  const parcels = pendingRes.data || [];
  const m = metricsRes.data || {
    pendingCollectionCount: 0,
    completedTodayCount: 0,
    inTransitCount: 0,
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              PARTNER COUNTER PORTAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Partner Destination Office Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Manage incoming bus arrivals, ready for collection inventory, and verified receiver parcel releases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/employee/tracking"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              Logistics Scan Tool
            </Link>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-purple-400 uppercase">
              <span>Ready for Collection</span>
              <Package className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-white">{m.pendingCollectionCount}</div>
            <p className="text-[11px] text-slate-400">Parcels at destination counter</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-emerald-400 uppercase">
              <span>Collected & Released Today</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{m.completedTodayCount}</div>
            <p className="text-[11px] text-slate-400">Verified receiver collections</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-amber-400 uppercase">
              <span>Incoming In-Transit</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-3xl font-black text-amber-400">{m.inTransitCount}</div>
            <p className="text-[11px] text-slate-400">Buses currently on route</p>
          </div>
        </div>

        {/* INVENTORY & COLLECTION TABLE */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Counter Parcel Inventory ({parcels.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase">
                  <th className="py-2.5 px-3">LR Number</th>
                  <th className="py-2.5 px-3">Origin Office</th>
                  <th className="py-2.5 px-3">Receiver Details</th>
                  <th className="py-2.5 px-3">Amount Due</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {parcels.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No parcels currently awaiting collection at this office.
                    </td>
                  </tr>
                ) : (
                  parcels.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-950/50">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {b.lrNumber}
                      </td>
                      <td className="py-3 px-3">
                        {b.originOffice?.name} ({b.originOffice?.city})
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-white">{b.receiverName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{b.receiverPhone}</p>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">
                        ₹{b.totalAmount}{" "}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
                            b.paymentStatus ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {b.paymentType}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <Link
                          href={`/track/${b.lrNumber}`}
                          className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 font-bold hover:bg-blue-600 hover:text-white transition"
                        >
                          Update / Release
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
