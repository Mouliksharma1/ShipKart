import React from 'react';
import { getCustomerAnalytics } from '@/lib/services/analytics/customer.service';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { Users, UserCheck, UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CustomersReportPage() {
  const data = await getCustomerAnalytics();

  const exportHeaders = ['Shipper Name', 'Phone Number', 'Total Bookings', 'Lifetime Value (₹)'];
  const exportData = data.topCustomers.map((c) => ({
    'Shipper Name': c.name,
    'Phone Number': c.phone,
    'Total Bookings': c.count,
    'Lifetime Value (₹)': c.totalSpent,
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Customers</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Customer & Shipper Accounts Intelligence</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="CUSTOMER_INTELLIGENCE" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Shipper Accounts</div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{data.totalCustomers}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Unique sender phone numbers</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Repeat / Returning Customers</div>
          <div className="text-2xl font-mono font-black text-amber-600 dark:text-amber-400">{data.returningCustomersCount}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Customers with &gt;1 booking</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">New Shippers</div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">{data.newCustomersCount}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Single booking customers</div>
        </div>
      </div>

      {/* Top Customer Accounts Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200">
          Top Shipper Accounts by Lifetime Value (LTV)
        </div>
        {data.topCustomers.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Total Parcel Bookings</th>
                  <th className="p-4 text-right">Lifetime Freight Spent (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {data.topCustomers.map((cust) => (
                  <tr key={cust.phone} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{cust.name}</td>
                    <td className="p-4 font-mono text-slate-600 dark:text-zinc-400">{cust.phone}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{cust.count} parcels</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{cust.totalSpent.toLocaleString('en-IN')}</td>
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
