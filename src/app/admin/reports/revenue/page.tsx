import React from 'react';
import { getRevenueSummary } from '@/lib/services/analytics/revenue.service';
import { DashboardHeader } from '@/components/reports/DashboardHeader';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { DollarSign, CreditCard, Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RevenueReportPage() {
  const data = await getRevenueSummary();

  const exportHeaders = ['Office Name', 'Revenue (₹)', 'Booking Count'];
  const exportData = data.officeRevenue.map((o) => ({
    'Office Name': o.officeName,
    'Revenue (₹)': o.total,
    'Booking Count': o.count,
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Revenue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Revenue & Financial Analytics</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="REVENUE_ANALYTICS" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Gross Revenue</div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">₹{data.totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">{data.bookingCount} total parcels booked</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Paid Revenue (Collected)</div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">₹{data.paidRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Cash & instant UPI collections</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">To-Pay / Pending Collection</div>
          <div className="text-2xl font-mono font-black text-amber-600 dark:text-amber-400">₹{data.toPayRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Collectable upon destination arrival</div>
        </div>
      </div>

      {/* Payment Channel Split */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
          <CreditCard className="w-4 h-4 mr-2 text-amber-500" /> Payment Channel Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {Object.entries(data.paymentTypeSplit).map(([type, amount]) => (
            <div key={type} className="p-4 bg-slate-50 dark:bg-zinc-800/40 rounded-2xl border border-slate-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-zinc-300">{type}</span>
              <span className="font-mono font-extrabold text-slate-900 dark:text-white">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Office Wise Revenue Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center justify-between">
          <span>Branch Office Revenue Contribution</span>
          <span className="text-xs text-slate-400 dark:text-zinc-500">{data.officeRevenue.length} active offices</span>
        </div>
        {data.officeRevenue.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">Branch Office</th>
                  <th className="p-4">Parcels Booked</th>
                  <th className="p-4 text-right">Total Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {data.officeRevenue.map((off) => (
                  <tr key={off.officeName} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{off.officeName}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{off.count} parcels</td>
                    <td className="p-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">₹{off.total.toLocaleString('en-IN')}</td>
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
