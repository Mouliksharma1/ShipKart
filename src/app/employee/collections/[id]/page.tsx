'use client';

import React, { useEffect, useState, use } from 'react';
import { getPendingCollectionsAction, unloadParcelAction } from '@/app/actions/collection';
import { CollectionStatusBadge } from '@/components/collection/CollectionStatusBadge';
import { OTPDialog } from '@/components/collection/OTPDialog';
import { Package, User, Phone, MapPin, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    const res = await getPendingCollectionsAction(undefined, resolvedParams.id);
    if (res.success && res.data && res.data.length > 0) {
      setBooking(res.data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooking();
  }, [resolvedParams.id]);

  const handleUnload = async () => {
    if (!booking) return;
    await unloadParcelAction(booking.id);
    fetchBooking();
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500 font-semibold text-xs">Loading parcel handover details...</div>;
  }

  if (!booking) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-sm font-bold text-slate-500">Parcel collection record not found.</p>
        <Link href="/employee/collections" className="text-xs text-amber-600 font-bold hover:underline">
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-neutral-950 text-slate-900 dark:text-zinc-100 p-6 lg:p-10 space-y-8 transition-colors">
      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
        <div>
          <Link href="/employee/collections" className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline inline-flex items-center mb-1">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Collections
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Parcel Handover: LR #{booking.lrNumber}</h1>
        </div>
        <CollectionStatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking & Parcel Info */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-zinc-800 pb-3">
            Consignment Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 dark:text-zinc-500 font-semibold block text-[10px] uppercase">Origin Office</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">{booking.originOffice?.name || 'Origin'}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-zinc-500 font-semibold block text-[10px] uppercase">Destination Office</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">{booking.destinationOffice?.name || 'Destination'}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-zinc-500 font-semibold block text-[10px] uppercase">Payment Mode</span>
              <span className="font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 block">{booking.paymentType}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-zinc-500 font-semibold block text-[10px] uppercase">Amount Payable</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base mt-0.5 block">₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-zinc-800 pb-3">
            Parties & Contact Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 dark:text-zinc-500 font-semibold block text-[10px] uppercase">Receiver Name</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">{booking.receiverName}</span>
              <span className="text-[10px] font-mono text-slate-500 block">{booking.receiverPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-zinc-500 font-semibold block text-[10px] uppercase">Sender Name</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">{booking.senderName}</span>
              <span className="text-[10px] font-mono text-slate-500 block">{booking.senderPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Destination Handover Actions</h4>
          <p className="text-xs text-slate-500 dark:text-zinc-400">Unload cargo or initiate OTP verification to complete handover</p>
        </div>

        <div className="flex items-center space-x-3">
          {booking.status === 'ARRIVED_AT_DESTINATION_OFFICE' && (
            <button
              onClick={handleUnload}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-extrabold transition shadow-xs"
            >
              Mark Ready for Pickup
            </button>
          )}

          <button
            onClick={() => setIsOtpOpen(true)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-2xl text-xs font-extrabold transition shadow-xs flex items-center"
          >
            <KeyRound className="w-4 h-4 mr-1.5" /> Generate OTP & Handover
          </button>
        </div>
      </div>

      <OTPDialog
        isOpen={isOtpOpen}
        bookingId={booking.id}
        lrNumber={booking.lrNumber}
        receiverName={booking.receiverName}
        receiverPhone={booking.receiverPhone}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={() => fetchBooking()}
      />
    </div>
  );
}
