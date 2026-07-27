import React from 'react';
import { getEmployeeAnalytics } from '@/lib/services/analytics/employee.service';
import { ExportButton } from '@/components/reports/ExportButton';
import { EmptyReport } from '@/components/reports/EmptyReport';
import { Users, Award, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EmployeesReportPage() {
  const data = await getEmployeeAnalytics();

  const exportHeaders = ['Employee Code', 'Staff Name', 'Role', 'Office', 'Parcels Processed', 'Collections Handled (₹)'];
  const exportData = data.leaderboard.map((emp) => ({
    'Employee Code': emp.employeeCode || 'N/A',
    'Staff Name': emp.name,
    'Role': emp.role,
    'Office': emp.office?.name || 'Unassigned',
    'Parcels Processed': emp.bookingsCount,
    'Collections Handled (₹)': emp.collectionsAmount,
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Employees</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Staff Productivity & Branch Leaderboard</h1>
        </div>

        <div className="flex items-center space-x-3">
          <ExportButton reportName="EMPLOYEE_PRODUCTIVITY" headers={exportHeaders} data={exportData} />
          <Link href="/admin/reports" className="flex items-center px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to BI Hub
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">Total Registered Staff</div>
          <div className="text-2xl font-mono font-black text-slate-900 dark:text-white">{data.totalEmployees}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Counter executives, managers, and drivers</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Active Operational Staff</div>
          <div className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">{data.activeEmployees}</div>
          <div className="text-[11px] text-slate-400 dark:text-zinc-500">Currently active account status</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 font-bold text-sm text-slate-800 dark:text-zinc-200 flex items-center justify-between">
          <span>Employee Productivity Leaderboard</span>
          <Award className="w-4 h-4 text-amber-500" />
        </div>
        {data.leaderboard.length === 0 ? (
          <EmptyReport />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/60 border-b border-slate-200/80 dark:border-zinc-800 text-slate-500 dark:text-zinc-400 font-bold uppercase">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Assigned Branch</th>
                  <th className="p-4">Bookings Handled</th>
                  <th className="p-4 text-right">Collections (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {data.leaderboard.map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center">
                        <span className="w-5 font-mono text-slate-400 dark:text-zinc-500">#{index + 1}</span>
                        {emp.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 ml-5">{emp.employeeCode || 'EMP-SYS'}</div>
                    </td>
                    <td className="p-4 uppercase font-semibold text-slate-600 dark:text-zinc-400">{emp.role}</td>
                    <td className="p-4 text-slate-700 dark:text-zinc-300">{emp.office?.name || 'Unassigned'}</td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{emp.bookingsCount} parcels</td>
                    <td className="p-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">₹{emp.collectionsAmount.toLocaleString('en-IN')}</td>
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
