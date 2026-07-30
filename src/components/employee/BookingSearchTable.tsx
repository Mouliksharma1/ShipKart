"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, Calendar, FileText, ArrowRight, User, Phone, CheckCircle, Clock } from "lucide-react";
import { BookingStatus, PaymentType } from "@prisma/client";
import { searchBookingsAction } from "@/app/actions/employee-booking";

interface BookingSearchTableProps {
  initialBookings: any[];
}

export function BookingSearchTable({ initialBookings }: BookingSearchTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const res = await searchBookingsAction({
      search: search || undefined,
      status: (status as BookingStatus) || undefined,
      paymentType: (paymentType as PaymentType) || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    setIsSearching(false);
    if (res.success && res.data) {
      setBookings(res.data);
    }
  };

  return (
    <div className="space-y-6">
      {/* SEARCH FILTERS CARD */}
      <form onSubmit={handleSearch} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-neutral-800 pb-3">
          <Search className="h-4 w-4 text-amber-500" />
          <span>Filter & Search Consignments</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
              Search Query
            </label>
            <input
              type="text"
              placeholder="LR / Name / Mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
              Status Filter
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="">All Statuses</option>
              {Object.values(BookingStatus).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
              Payment Filter
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="">All Payments</option>
              <option value="PAID">PAID</option>
              <option value="TO_PAY">TO PAY</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSearching}
            className="py-2.5 px-6 rounded-xl bg-amber-500 font-bold text-amber-950 text-xs hover:bg-amber-400 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </form>

      {/* RESULTS TABLE */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Matching Consignments ({bookings.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-3 font-semibold">LR Number</th>
                <th className="py-3 px-3 font-semibold">Sender Details</th>
                <th className="py-3 px-3 font-semibold">Receiver Details</th>
                <th className="py-3 px-3 font-semibold">Route</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Total Amount</th>
                <th className="py-3 px-3 font-semibold">Date</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No matching consignment records found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">
                      <Link href={`/employee/bookings/${b.lrNumber}`}>{b.lrNumber}</Link>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{b.senderName}</p>
                      <p className="text-[10px] text-slate-500">{b.senderPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{b.receiverName}</p>
                      <p className="text-[10px] text-slate-500">{b.receiverPhone}</p>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-neutral-300">
                      {b.originOffice?.name} &rarr; {b.destinationOffice?.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      ₹{b.totalAmount} ({b.paymentType})
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <Link
                          href={`/employee/bookings/${b.lrNumber}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-neutral-700 font-bold text-[11px] transition-colors"
                        >
                          Details
                        </Link>
                        <Link
                          href={`/lr/${b.id}`}
                          target="_blank"
                          className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white font-black text-[11px] transition-colors"
                        >
                          Digital LR
                        </Link>
                        <Link
                          href={`/employee/book?repeatLr=${b.lrNumber}`}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-amber-950 font-black text-[11px] transition-all"
                        >
                          Repeat
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
