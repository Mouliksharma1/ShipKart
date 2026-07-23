"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  MapPin,
  Truck,
  User,
  Phone,
  Calendar,
  CheckCircle2,
  Download,
  QrCode,
  ArrowLeft,
  CreditCard,
  Box,
} from "lucide-react";

export default function BookingDetailsClient({ booking: b }: { booking: any }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/customer/history"
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-amber-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bookings</span>
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 text-amber-950 font-bold text-xs hover:bg-amber-400 shadow-md transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download / Print Digital LR</span>
        </button>
      </div>

      {/* PRINTABLE DIGITAL LR RECEIPT CARD */}
      <div className="rounded-3xl border border-amber-500/30 bg-white dark:bg-neutral-900 p-8 shadow-2xl space-y-6 text-xs print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-5">
          <div>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">POOJA TRAVELS & CARGO LOGISTICS</span>
            <h1 className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">{b.lrNumber}</h1>
            <p className="text-[11px] text-slate-400">Booked on {new Date(b.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white text-black rounded-xl border border-slate-200 flex flex-col items-center">
              <QrCode className="h-10 w-10" />
              <span className="text-[9px] font-mono font-bold mt-1">{b.lrNumber}</span>
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">ORIGIN OFFICE</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{b.originOffice.name}</p>
            <p className="text-slate-500">{b.originOffice.city}, {b.originOffice.state}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">DESTINATION OFFICE</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">{b.destinationOffice.name}</p>
            <p className="text-slate-500">{b.destinationOffice.city}, {b.destinationOffice.state}</p>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
            <span className="font-bold text-amber-500 uppercase text-[10px]">SENDER</span>
            <p className="font-bold text-slate-900 dark:text-white">{b.senderName}</p>
            <p className="text-slate-500">{b.senderPhone}</p>
            {b.pickupAddress && <p className="text-slate-400 text-[11px]">{b.pickupAddress}</p>}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 space-y-1">
            <span className="font-bold text-amber-500 uppercase text-[10px]">RECEIVER</span>
            <p className="font-bold text-slate-900 dark:text-white">{b.receiverName}</p>
            <p className="text-slate-500">{b.receiverPhone}</p>
          </div>
        </div>

        {/* Consignment Items & Price Snapshots */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 dark:text-white">Consignment Itemized Snapshots</span>
          <div className="rounded-xl border border-slate-200 dark:border-neutral-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-neutral-950 font-bold">
                <tr>
                  <th className="p-2.5">Item</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5">Unit Snapshot</th>
                  <th className="p-2.5">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
                {b.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="p-2.5 font-bold">{item.parcelType}</td>
                    <td className="p-2.5">{item.quantity}</td>
                    <td className="p-2.5 font-mono">₹{item.unitPrice}</td>
                    <td className="p-2.5 font-mono font-bold">₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-sm font-bold">
            <span>Grand Total Charged</span>
            <span className="text-xl font-black font-mono">₹{b.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
