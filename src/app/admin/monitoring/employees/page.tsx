'use client';

import React, { useEffect, useState } from 'react';
import { getEmployeeMonitoringAction } from '@/app/actions/admin/monitoring';
import { LiveStatusIndicator } from '@/components/monitoring/LiveStatusIndicator';
import { Users, Award, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeMonitoringPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    const res = await getEmployeeMonitoringAction();
    if (res.success && res.data) {
      setEmployees(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
    const interval = setInterval(fetchEmployees, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/admin/monitoring" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Operations
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Staff Productivity</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Staff Productivity & Leaderboard</h1>
        </div>
        <LiveStatusIndicator />
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Employee Productivity Leaderboard</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading employee monitoring data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Employee Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Office Location</th>
                  <th className="p-4">Bookings Today</th>
                  <th className="p-4">Collections (₹)</th>
                  <th className="p-4">Turnaround Speed</th>
                  <th className="p-4">Productivity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 font-medium">
                    <td className="p-4 font-black text-amber-600 dark:text-amber-400">#{emp.rank}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{emp.name}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{emp.role}</td>
                    <td className="p-4">{emp.officeName}</td>
                    <td className="p-4 font-extrabold text-amber-600 dark:text-amber-400">{emp.bookingsProcessedToday}</td>
                    <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">₹{emp.collectionsTotal.toLocaleString()}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{emp.avgProcessingMinutes} mins/booking</td>
                    <td className="p-4 font-black text-purple-600 dark:text-purple-400">{emp.productivityScore}/100</td>
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
