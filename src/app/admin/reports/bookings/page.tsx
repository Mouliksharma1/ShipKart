import React from 'react';
import { getBookingAnalytics } from '@/lib/services/analytics/booking.service';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { Package, Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BookingsReportPage() {
  const data = await getBookingAnalytics();

  const exportHeaders = ['LR Number', 'Parcel Type', 'Status', 'Grand Total (₹)', 'Origin Office'];
  const exportData = data.bookings.map((b) => ({
    'LR Number': b.lrNumber,
    'Parcel Type': b.items[0]?.parcelType || 'BOX',
    'Status': b.status,
    'Grand Total (₹)': b.totalAmount,
    'Origin Office': b.originOffice?.name || 'Unassigned',
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">Admin</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <Link href="/admin/reports" className="text-xs text-slate-500 dark:text-zinc-400 font-semibold hover:underline">Reports</Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Bookings</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Freight Volume & Booking Analytics</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="BOOKING_ANALYTICS" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Parcel Bookings</div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{data.totalBookings}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Cumulative parcel count</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Average Ticket Value</div>
          <div className="text-2xl font-mono font-black text-amber-600 dark:text-amber-400">₹{data.averageValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Average price per booking</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Total Gross Freight Value</div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">₹{data.totalValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Sum of grand totals</div>
        </div>
      </div>

      {/* Parcel Type Breakdown */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
          <Tag className="w-4 h-4 mr-2 text-amber-500" /> Parcel Type Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {Object.entries(data.parcelTypeBreakdown).map(([type, count]) => (
            <div key={type} className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <div className="font-extrabold uppercase text-[10px] text-slate-400 dark:text-zinc-500">{type}</div>
              <div className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table of Recent Bookings */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200">
          Booking Records ({data.bookings.length})
        </div>
        {data.bookings.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Origin Branch</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {data.bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      <div>{b.lrNumber}</div>
                      {b.pickupMethod === "TAXI_PICKUP" && (
                        <div className="mt-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-amber-950 border border-amber-600 inline-flex items-center space-x-1 shadow-xs">
                            <span>🚖 TAXI PICKUP</span>
                          </span>
                          {b.pickupAddress && (
                            <p className="text-[10px] font-normal text-amber-600 dark:text-amber-400 mt-0.5 font-sans">
                              📍 {b.pickupAddress}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 uppercase font-semibold text-slate-600 dark:text-zinc-400">{b.items[0]?.parcelType || 'BOX'}</td>
                    <td className="p-4 text-slate-700 dark:text-zinc-300">{b.originOffice?.name || 'Unassigned'}</td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{b.status}</td>
                    <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">₹{b.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
