'use client';

import React, { useEffect, useState } from 'react';
import { getCashBookAction, addCashEntryAction } from '@/app/actions/finance';
import { Receipt, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DailyCashBookPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);
  const [openingAmount, setOpeningAmount] = useState('');

  const fetchCashBook = async () => {
    setLoading(true);
    const res = await getCashBookAction();
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCashBook();
  }, []);

  const handleAddOpeningBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openingAmount || isNaN(Number(openingAmount))) return;
    await addCashEntryAction({
      officeId: 'DEFAULT',
      transactionType: 'OPENING_BALANCE',
      amount: Number(openingAmount),
      description: 'Daily counter opening cash float balance',
      createdBy: 'COUNTER_STAFF'
    });
    setIsOpeningModalOpen(false);
    fetchCashBook();
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Cash Book</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Daily Cash Book Ledger</h1>
        </div>

        <button
          onClick={() => setIsOpeningModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition shadow-xs"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" /> Add Opening Balance
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Today&apos;s Cash Transactions</h3>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">{data?.list?.length || 0} Entries</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading Cash Book entries...</p>
        ) : data?.list?.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No cash transactions recorded today.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Transaction Type</th>
                  <th className="p-4">LR #</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {data?.list?.map((entry: any) => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 text-slate-500 font-mono">{new Date(entry.createdAt).toLocaleTimeString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${entry.transactionType === 'EXPENSE' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {entry.transactionType}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{entry.booking?.lrNumber || '-'}</td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400">{entry.description || '-'}</td>
                    <td className={`p-4 text-right font-black ${entry.transactionType === 'EXPENSE' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {entry.transactionType === 'EXPENSE' ? '-' : '+'}₹{entry.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isOpeningModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <form onSubmit={handleAddOpeningBalance} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Add Opening Cash Float</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Opening Amount (₹)</label>
              <input
                type="number"
                value={openingAmount}
                onChange={(e) => setOpeningAmount(e.target.value)}
                placeholder="5000"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsOpeningModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-amber-500 text-amber-950 rounded-xl text-xs font-extrabold">Save Opening Float</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
