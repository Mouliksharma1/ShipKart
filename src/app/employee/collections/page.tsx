'use client';

import React, { useEffect, useState } from 'react';
import { getPendingCollectionsAction, getCollectedBookingsAction } from '@/app/actions/collection';
import { CollectionStatusBadge } from '@/components/collection/CollectionStatusBadge';
import { OTPDialog } from '@/components/collection/OTPDialog';
import { Package, Search, KeyRound, CheckCircle2, Clock, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmployeeCollectionDashboardPage() {
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [collectedList, setCollectedList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<any | null>(null);

  const fetchData = async (q?: string) => {
    setLoading(true);
    const [pendingRes, collectedRes] = await Promise.all([
      getPendingCollectionsAction(undefined, q),
      getCollectedBookingsAction()
    ]);

    if (pendingRes.success && pendingRes.data) setPendingList(pendingRes.data);
    if (collectedRes.success && collectedRes.data) setCollectedList(collectedRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  const readyCount = pendingList.filter(b => b.status === 'READY_FOR_COLLECTION').length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/employee" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Employee Portal
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Destination Office Collections</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Parcel Collection & Handover Center</h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search LR #, Receiver, Mobile..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition">
            Search
          </button>
        </form>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Pending In-Office Collections</span>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-2">{pendingList.length}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Awaiting customer collection</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Ready For Pickup</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">{readyCount}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Unloaded & customer notified</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase">Collected Today</span>
          <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block mt-2">{collectedList.length}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Completed OTP handovers today</span>
        </div>
      </div>

      {/* Pending Collection Queue Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Destination Pending Collection Parcels</h3>
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">{pendingList.length} Parcels Listed</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading pending collections...</p>
        ) : pendingList.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No pending collection parcels found for this branch office.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Origin Branch</th>
                  <th className="p-4">Payment Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Handover Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60">
                {pendingList.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 font-medium">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{b.lrNumber}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{b.receiverName}</td>
                    <td className="p-4 font-mono">{b.receiverPhone}</td>
                    <td className="p-4">{b.originOffice?.name || 'Origin'}</td>
                    <td className="p-4 font-bold text-amber-600 dark:text-amber-400">{b.paymentType} (₹{b.totalAmount})</td>
                    <td className="p-4">
                      <CollectionStatusBadge status={b.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedBookingForOtp(b)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold transition inline-flex items-center shadow-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5 mr-1.5" /> OTP Handover
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
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
}
