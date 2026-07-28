'use client';

import React, { useEffect, useState } from 'react';
import { getPartnerCollectionsAction } from '@/app/actions/partner';
import { CollectionStatusBadge } from '@/components/collection/CollectionStatusBadge';
import { OTPDialog } from '@/components/collection/OTPDialog';
import { Package, KeyRound, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PartnerCollectionsPage() {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<any | null>(null);

  const fetchCollections = async (q?: string) => {
    setLoading(true);
    const res = await getPartnerCollectionsAction(undefined, q);
    if (res.success && res.data) {
      setPendingList(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCollections(query);
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
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Collections Terminal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Partner Parcel Collections & OTP Verification</h1>
        </div>

        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search LR #, Receiver Name/Mobile..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition">
            Filter
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/60 dark:border-zinc-800">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">Uncollected Consignments</h3>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading pending collections...</p>
        ) : pendingList.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No uncollected parcels pending at this partner branch.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Origin Office</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {pendingList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{b.lrNumber}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{b.receiverName}</td>
                    <td className="p-4 font-mono">{b.receiverPhone}</td>
                    <td className="p-4">{b.originOffice?.name || 'Origin'}</td>
                    <td className="p-4 font-black text-amber-600 dark:text-amber-400">₹{b.totalAmount} ({b.paymentType})</td>
                    <td className="p-4"><CollectionStatusBadge status={b.status} /></td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedBookingForOtp(b)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold transition inline-flex items-center shadow-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5 mr-1.5" /> Verify OTP & Release
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBookingForOtp && (
        <OTPDialog
          isOpen={!!selectedBookingForOtp}
          bookingId={selectedBookingForOtp.id}
          lrNumber={selectedBookingForOtp.lrNumber}
          receiverName={selectedBookingForOtp.receiverName}
          receiverPhone={selectedBookingForOtp.receiverPhone}
          onClose={() => setSelectedBookingForOtp(null)}
          onSuccess={() => fetchCollections()}
        />
      )}
    </div>
  );
}
