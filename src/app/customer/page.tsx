'use client';

import React, { useEffect, useState } from 'react';
import { getBookingHistoryAction } from '@/app/actions/customer';
import { Package, Truck, CheckCircle2, Clock, Search, ArrowRight, Download, User, Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const [phone, setPhone] = useState('9876543210');
  const [inputPhone, setInputPhone] = useState('9876543210');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [quickLrSearch, setQuickLrSearch] = useState('');

  const fetchBookings = async (userPhone: string) => {
    if (!userPhone) return;
    setLoading(true);
    const res = await getBookingHistoryAction(userPhone);
    if (res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings(phone);
  }, [phone]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPhone.trim()) {
      setPhone(inputPhone.trim());
    }
  };

  const activeCount = bookings.filter(b => ['BOOKED', 'IN_TRANSIT', 'READY_FOR_COLLECTION'].includes(b.status)).length;
  const deliveredCount = bookings.filter(b => ['COLLECTED', 'COMPLETED'].includes(b.status)).length;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      {/* Interactive Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-8 text-amber-950 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-950">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Self-Service Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-amber-950">
            Track, Manage & Control Your Cargo Shipments
          </h1>

          <p className="text-xs sm:text-sm font-semibold opacity-90 text-amber-950 max-w-xl">
            Enter your registered mobile number or LR Number to instantly access live tracking, digital builty receipts, and consignment history.
          </p>

          {/* Dynamic Mobile Switcher & Quick Track Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <form onSubmit={handlePhoneSubmit} className="flex items-center space-x-2 bg-white/95 dark:bg-zinc-900/90 p-1.5 rounded-2xl w-full sm:w-auto shadow-md">
              <Phone className="w-4 h-4 text-amber-600 ml-3" />
              <input
                type="text"
                value={inputPhone}
                onChange={(e) => setInputPhone(e.target.value)}
                placeholder="Enter Customer Mobile #"
                className="px-2 py-2 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none w-44"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-extrabold rounded-xl transition shadow-xs"
              >
                Load Account
              </button>
            </form>

            <div className="flex items-center space-x-2 bg-white/95 dark:bg-zinc-900/90 p-1.5 rounded-2xl w-full sm:w-auto shadow-md">
              <Search className="w-4 h-4 text-slate-400 ml-3" />
              <input
                type="text"
                value={quickLrSearch}
                onChange={(e) => setQuickLrSearch(e.target.value)}
                placeholder="Track LR # (e.g. SK-1002)"
                className="px-2 py-2 bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none w-44"
              />
              {quickLrSearch ? (
                <Link
                  href={`/track/${quickLrSearch.trim()}`}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold rounded-xl transition shadow-xs"
                >
                  Track Now
                </Link>
              ) : (
                <button disabled className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 text-slate-400 text-xs font-extrabold rounded-xl">
                  Track
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/customer/history" className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 transition-all shadow-xs group">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Shipments</span>
            <Package className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mt-2">{bookings.length}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block flex items-center">
            View full shipment archive <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </Link>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Active In-Transit</span>
            <Truck className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block mt-2">{activeCount}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Parcels moving on road</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-semibold uppercase">Delivered</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-2">{deliveredCount}</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-1 block">Successfully handed over</span>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/customer/history" className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs">
          <Package className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Booking History</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">All Builty Consignments</span>
        </Link>

        <Link href="/customer/profile" className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Account Profile</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Address & Details</span>
        </Link>

        <Link href="/offices" className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs">
          <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Branch Locator</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Find Office Locations</span>
        </Link>

        <Link href="/customer/settings/notifications" className="p-5 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500 rounded-2xl flex flex-col items-center text-center transition-all shadow-xs">
          <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
          <span className="font-extrabold text-xs text-slate-900 dark:text-white">Notification Alerts</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">WhatsApp / SMS Rules</span>
        </Link>
      </div>

      {/* Interactive Shipments List */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Active Consignment List</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Showing shipments for customer phone <strong className="text-amber-600 dark:text-amber-400">{phone || 'None'}</strong></p>
          </div>
          <Link href="/customer/history" className="text-xs font-extrabold text-amber-600 dark:text-amber-400 hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading live consignment data...</p>
        ) : bookings.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No consignment records found for mobile #{phone}. Enter another phone number in the top banner to test.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
              <thead className="bg-slate-50 dark:bg-zinc-950 text-slate-400 dark:text-zinc-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-zinc-800 font-extrabold">
                <tr>
                  <th className="p-4">LR Number</th>
                  <th className="p-4">Route Corridor</th>
                  <th className="p-4">Receiver</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Interactive Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-zinc-800/60 font-medium">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-extrabold text-slate-900 dark:text-white">{b.lrNumber}</td>
                    <td className="p-4 font-bold">{b.originOffice?.name || 'Origin'} → {b.destinationOffice?.name || 'Destination'}</td>
                    <td className="p-4">{b.receiverName} ({b.receiverPhone})</td>
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
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl text-xs font-extrabold transition inline-flex items-center shadow-xs"
                      >
                        Track Live
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
