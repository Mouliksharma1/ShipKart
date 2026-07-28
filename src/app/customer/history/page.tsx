'use client';

import React, { useEffect, useState } from 'react';
import { getBookingHistoryAction } from '@/app/actions/customer';
import { Search, Download, ExternalLink, ArrowLeft, Filter, Phone, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CustomerBookingHistoryPage() {
  const [phone, setPhone] = useState('9876543210');
  const [inputPhone, setInputPhone] = useState('9876543210');
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async (userPhone: string, q?: string, status?: string) => {
    if (!userPhone) return;
    setLoading(true);
    const res = await getBookingHistoryAction(userPhone, q, status);
    if (res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory(phone, searchQuery, statusFilter);
  }, [phone, searchQuery, statusFilter]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPhone.trim()) {
      setPhone(inputPhone.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/customer" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Customer Portal
            </Link>
            <span className="text-xs text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Booking History</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Consignment History & Digital Builty Archive</h1>
        </div>

        <form onSubmit={handlePhoneSubmit} className="flex items-center space-x-2 bg-slate-50 dark:bg-zinc-950 p-1.5 rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Phone className="w-4 h-4 text-amber-600 ml-2" />
          <input
            type="text"
            value={inputPhone}
            onChange={(e) => setInputPhone(e.target.value)}
            placeholder="Enter Mobile #"
            className="px-2 py-1.5 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none w-36"
          />
          <button type="submit" className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-extrabold rounded-xl transition">
            Switch User
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200/60 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Customer Booking Records</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Filtering history for mobile #{phone}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search LR # or Receiver..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="BOOKED">BOOKED</option>
              <option value="IN_TRANSIT">IN TRANSIT</option>
              <option value="READY_FOR_COLLECTION">READY FOR PICKUP</option>
              <option value="COMPLETED">DELIVERED</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading consignment history...</p>
        ) : bookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No consignment records found for phone #{phone}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Route</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{b.lrNumber}</td>
                    <td className="p-4 text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{b.senderName}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{b.receiverName}</td>
                    <td className="p-4">{b.originOffice?.name || 'Origin'} → {b.destinationOffice?.name || 'Destination'}</td>
                    <td className="p-4 font-black text-amber-600 dark:text-amber-400">₹{b.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/lr/${b.lrNumber}`}
                        target="_blank"
                        className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition inline-flex items-center"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> PDF LR
                      </Link>
                      <Link
                        href={`/track/${b.lrNumber}`}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold transition inline-flex items-center shadow-xs"
                      >
                        Track
                      </Link>
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
