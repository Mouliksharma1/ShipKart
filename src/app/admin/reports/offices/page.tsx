import React from 'react';
import { prisma } from '@/lib/db';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { Building, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OfficesReportPage() {
  const offices = await prisma.officeMaster.findMany({
    where: { isActive: true },
    include: {
      users: { select: { id: true } },
      originBookings: { select: { totalAmount: true } },
    },
  });

  const matrix = offices.map((off) => {
    const revenue = off.originBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const capacityUsed = Math.min(100, Math.round((off.currentStorageCapacity / off.maximumStorageCapacity) * 100));
    return {
      id: off.id,
      name: off.name,
      code: off.code || off.officeCode || 'OFF-SYS',
      type: off.officeType,
      city: off.city,
      staffCount: off.users.length,
      bookingsCount: off.originBookings.length,
      revenue,
      capacityUsed,
      maxCapacity: off.maximumStorageCapacity,
    };
  });

  matrix.sort((a, b) => b.revenue - a.revenue);

  const exportHeaders = ['Office Code', 'Office Name', 'Type', 'City', 'Staff Count', 'Bookings Count', 'Revenue (₹)', 'Capacity Used (%)'];
  const exportData = matrix.map((m) => ({
    'Office Code': m.code,
    'Office Name': m.name,
    'Type': m.type,
    'City': m.city,
    'Staff Count': m.staffCount,
    'Bookings Count': m.bookingsCount,
    'Revenue (₹)': m.revenue,
    'Capacity Used (%)': `${m.capacityUsed}%`,
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Offices</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Branch Office Comparison Matrix</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="OFFICE_COMPARISON_MATRIX" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200">
          Enterprise Branch Comparison ({matrix.length} offices)
        </div>
        {matrix.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">Office Code</th>
                  <th className="p-4">Office Name</th>
                  <th className="p-4">Type & City</th>
                  <th className="p-4">Staff Count</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Storage Usage</th>
                  <th className="p-4 text-right">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {matrix.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{off.code}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{off.name}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{off.type} ({off.city})</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{off.staffCount} staff</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{off.bookingsCount} parcels</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400 font-mono">
                          <span>{off.capacityUsed}%</span>
                          <span>{off.maxCapacity} cap</span>
                        </div>
                        <div className="w-24 bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${off.capacityUsed > 85 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${off.capacityUsed}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">₹{off.revenue.toLocaleString('en-IN')}</td>
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
