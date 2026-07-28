'use client';

import React, { useEffect, useState } from 'react';
import { getPendingToPayAction, collectToPayAction } from '@/app/actions/finance';
import { IndianRupee, Search, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ToPayCollectionPage() {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPending = async (q?: string) => {
    setLoading(true);
    const res = await getPendingToPayAction(undefined, q);
    if (res.success && res.data) {
      setPendingList(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPending(query);
  };

  const handleCollect = async (bookingId: string) => {
    await collectToPayAction(bookingId, 'COUNTER_STAFF', 'DEFAULT');
    fetchPending(query);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/employee/finance" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Finance
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">To-Pay Collections</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Pending To-Pay Parcel Clearances</h1>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search LR #, Receiver Name/Mobile..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition">
            Filter
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Uncollected To-Pay Parcels</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading pending To-Pay parcels...</p>
        ) : pendingList.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No pending To-Pay collections found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Origin Branch</th>
                  <th className="p-4">Amount Due</th>
                  <th className="p-4 text-right">Collect Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {pendingList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{b.lrNumber}</td>
                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{b.receiverName}</td>
                    <td className="p-4 font-mono">{b.receiverPhone}</td>
                    <td className="p-4">{b.originOffice?.name || 'Origin'}</td>
                    <td className="p-4 font-black text-amber-600 dark:text-amber-400 text-sm">₹{b.totalAmount}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleCollect(b.id)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition inline-flex items-center shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Collect ₹{b.totalAmount}
                      </button>
                    </td>
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
