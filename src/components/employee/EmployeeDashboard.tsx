"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  FileText, 
  PlusCircle, 
  Search, 
  RotateCcw, 
  Users, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Truck
} from "lucide-react";

interface EmployeeDashboardProps {
  metrics: {
    todayBookingsCount: number;
    todayRevenue: number;
    pendingPaymentsCount: number;
    pendingCollectionsCount: number;
    todayLrCount: number;
    recentBookings: any[];
  };
}

export function EmployeeDashboard({ metrics }: EmployeeDashboardProps) {
  const [searchLr, setSearchLr] = useState("");

  return (
    <div className="space-y-8">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
              OFFICE COUNTER TERMINAL
            </span>
            <span className="text-xs text-slate-500 dark:text-neutral-400">Pooja Travels & Cargo</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Employee Counter Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/employee/finance"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all text-sm active:scale-95 shadow-md shadow-purple-600/20"
          >
            <IndianRupee className="h-5 w-5" />
            <span>Financial Operations</span>
          </Link>

          <Link
            href="/employee/collections"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-sm active:scale-95"
          >
            <Package className="h-5 w-5" />
            <span>Destination Collections</span>
          </Link>

          <Link
            href="/employee/book"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-amber-950 shadow-lg shadow-amber-500/20 transition-all text-sm active:scale-95"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Counter Booking</span>
          </Link>
        </div>


      </div>

      {/* DASHBOARD METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Today's Bookings */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">Today's Bookings</span>
            <Package className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.todayBookingsCount}</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" /> Live Counter Feed
          </span>
        </div>

        {/* Today's Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">Today's Revenue</span>
            <IndianRupee className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">₹{metrics.todayRevenue.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-slate-400 font-medium">Cash + UPI Collected</span>
        </div>

        {/* Pending Payments */}
        <Link
          href="/employee/finance/topay"
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-amber-500 transition-all block"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">Pending Payments</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.pendingPaymentsCount}</p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center">
            <span>TO PAY Clearances</span> <ArrowRight className="h-3 w-3 ml-1" />
          </span>
        </Link>

        {/* Pending Collections */}
        <Link
          href="/employee/collections"
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-2 hover:border-blue-500 transition-all block"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">Pending Collections</span>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.pendingCollectionsCount}</p>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center">
            <span>OTP Handover Center</span> <ArrowRight className="h-3 w-3 ml-1" />
          </span>
        </Link>


        {/* Today's LR Generated */}
        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-semibold">Today's LR Generated</span>
            <FileText className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.todayLrCount}</p>
          <span className="text-[10px] text-slate-400 font-medium">Sequential LR Numbers</span>
        </div>

        {/* Active Dispatches */}
        <Link
          href="/employee/dispatches"
          className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 shadow-sm block space-y-2 relative overflow-hidden"
        >
          <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">Active Dispatches</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Runs</p>
          <div className="flex items-center space-x-1.5 text-amber-600 dark:text-amber-400 font-extrabold text-[11px]">
            <span>Manage Vehicle Loading</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>


      {/* QUICK ACTIONS BAR */}
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-4">
        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
          Counter Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/employee/book"
            className="flex items-center space-x-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-amber-500 transition-all group"
          >
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-amber-950">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">New Booking</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">&lt; 30 sec entry</p>
            </div>
          </Link>

          <Link
            href="/employee/bookings"
            className="flex items-center space-x-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-amber-500 transition-all group"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Search LR</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">Phone or LR query</p>
            </div>
          </Link>

          <Link
            href="/employee/bookings"
            className="flex items-center space-x-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-amber-500 transition-all group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Repeat Booking</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">Clone previous LR</p>
            </div>
          </Link>

          <Link
            href="/employee/bookings"
            className="flex items-center space-x-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 hover:border-amber-500 transition-all group"
          >
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Customer Lookup</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">Saved receivers</p>
            </div>
          </Link>

          <div
            className="flex items-center space-x-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 opacity-60 cursor-not-allowed"
          >
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-neutral-800 text-slate-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Daily Closing</p>
              <p className="text-[10px] text-slate-500 dark:text-neutral-400">Milestone 10</p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK LR SEARCH FORM & RECENT BOOKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Search */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Search className="h-5 w-5 text-amber-500" />
            <span>Instant Counter Lookup</span>
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchLr.trim()) {
                window.location.href = `/employee/bookings/${searchLr.trim()}`;
              }
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-neutral-400 mb-1">
                LR Number / Customer Mobile
              </label>
              <input
                type="text"
                value={searchLr}
                onChange={(e) => setSearchLr(e.target.value)}
                placeholder="e.g. 0001 or 9829012345"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white text-sm focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 font-bold text-amber-950 text-xs hover:bg-amber-400 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Search Consignment Record</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Live Recent Counter Bookings Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Counter Bookings
            </h3>
            <Link
              href="/employee/bookings"
              className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              View All Bookings &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-semibold">LR Number</th>
                  <th className="py-2.5 px-3 font-semibold">Sender</th>
                  <th className="py-2.5 px-3 font-semibold">Receiver</th>
                  <th className="py-2.5 px-3 font-semibold">Route</th>
                  <th className="py-2.5 px-3 font-semibold">Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Payment</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/60">
                {metrics.recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No counter bookings recorded today.
                    </td>
                  </tr>
                ) : (
                  metrics.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">
                        <Link href={`/employee/bookings/${b.lrNumber}`}>{b.lrNumber}</Link>
                        {b.pickupMethod === "TAXI_PICKUP" && (
                          <div className="mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-amber-950 border border-amber-600 inline-flex items-center space-x-1 shadow-xs">
                              <span>🚖 TAXI PICKUP</span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{b.senderName}</p>
                        <p className="text-[10px] text-slate-500">{b.senderPhone}</p>
                        {b.pickupMethod === "TAXI_PICKUP" && b.pickupAddress && (
                          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                            📍 {b.pickupAddress}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{b.receiverName}</p>
                        <p className="text-[10px] text-slate-500">{b.receiverPhone}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-neutral-300">
                        {b.originOffice?.name || "Origin"} &rarr; {b.destinationOffice?.name || "Dest"}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        ₹{b.totalAmount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.paymentType === "PAID"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {b.paymentType}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/employee/bookings/${b.lrNumber}`}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-neutral-800 font-semibold text-slate-700 dark:text-neutral-300 hover:bg-amber-500 hover:text-amber-950 transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
