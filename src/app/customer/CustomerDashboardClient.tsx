"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  Search,
  ArrowRight,
  Truck,
  MapPin,
  Download,
  PhoneCall,
  Shield,
} from "lucide-react";

interface BookingSummary {
  id: string;
  lrNumber: string;
  senderName: string;
  receiverName: string;
  receiverPhone: string;
  totalAmount: number;
  status: string;
  createdAt: string | Date;
  originOffice: { name: string; city: string };
  destinationOffice: { name: string; city: string };
  items: Array<{ parcelType: string; quantity: number }>;
}

export default function CustomerDashboardClient({
  recentBookings,
}: {
  recentBookings: BookingSummary[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = recentBookings.filter(
    (b) =>
      b.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.receiverPhone.includes(searchTerm) ||
      b.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeBookings = recentBookings.filter((b) => b.status === "BOOKED" || b.status === "IN_TRANSIT");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Shield className="h-3.5 w-3.5" />
            <span>CUSTOMER PORTAL</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back, Customer</h1>
          <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-xl">
            Book consignments online, generate global LR receipts, and track shipments in real-time.
          </p>
        </div>

        <Link
          href="/customer/book"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 text-amber-950 font-black shadow-lg hover:bg-amber-400 transition-colors shrink-0"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Book Consignment</span>
        </Link>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Total Bookings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{recentBookings.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Active Shipments</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{activeBookings.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Delivered</span>
            <div className="text-2xl font-black text-green-600 dark:text-green-400 mt-1">
              {recentBookings.filter((b) => b.status === "COMPLETED").length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Quick Search & Recent Bookings List */}
      <div className="rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Consignment Bookings</h2>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by LR Number or Receiver..."
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-3">
            <Package className="h-10 w-10 mx-auto text-slate-400" />
            <p>No consignment bookings found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-neutral-800 text-xs">
            {filteredBookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                      {b.lrNumber}
                    </span>
                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-neutral-400 font-medium">
                    {b.originOffice.name} → {b.destinationOffice.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Receiver: {b.receiverName} ({b.receiverPhone})
                  </p>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right">
                    <span className="block font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ₹{b.totalAmount}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    href={`/customer/booking/${b.lrNumber}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-amber-500 transition-colors"
                    title="View LR Details"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
