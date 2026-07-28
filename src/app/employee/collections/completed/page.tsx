'use client';

import React, { useEffect, useState } from 'react';
import { getCollectedBookingsAction } from '@/app/actions/collection';
import { CollectionStatusBadge } from '@/components/collection/CollectionStatusBadge';
import { CheckCircle2, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CompletedCollectionsPage() {
  const [collectedList, setCollectedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompleted = async () => {
    setLoading(true);
    const res = await getCollectedBookingsAction();
    if (res.success && res.data) {
      setCollectedList(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompleted();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/employee/collections" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Collections
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Completed History</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Today&apos;s Completed Collections</h1>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Completed Parcel Handover Log</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading completed collections log...</p>
        ) : collectedList.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No completed collections recorded today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Collected By</th>
                  <th className="p-4">Time Collected</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {collectedList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{b.lrNumber}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{b.receiverName}</td>
                    <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">{b.collectedBy || b.receiverName}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{b.collectedAt ? new Date(b.collectedAt).toLocaleTimeString() : 'N/A'}</td>
                    <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">₹{b.totalAmount}</td>
                    <td className="p-4"><CollectionStatusBadge status={b.status} /></td>
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
