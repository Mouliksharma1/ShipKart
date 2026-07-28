'use client';

import React, { useEffect, useState } from 'react';
import { getPartnerOfficeReportAction } from '@/app/actions/partner';
import { FileText, IndianRupee, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PartnerReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReport = async (date?: string) => {
    setLoading(true);
    const res = await getPartnerOfficeReportAction(undefined, date);
    if (res.success && res.data) {
      setReport(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport(startDate);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/partner/dashboard" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Partner Dashboard
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Office Reports</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Partner Office Operational & Financial Report</h1>
        </div>

        <form onSubmit={handleFilter} className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white"
          />
          <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition">
            Filter Report
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Gross Revenue</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">₹{(report?.grossRevenue || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Total paid counter collections</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Branch Expenses</span>
          <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mt-2">₹{(report?.totalExpenses || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Fuel, salary & maintenance</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Net Revenue</span>
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block mt-2">₹{(report?.netRevenue || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Earnings after expenses</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Total Bookings</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-2">{report?.bookingsCount || 0}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Consignments booked</span>
        </div>
      </div>
    </div>
  );
}
