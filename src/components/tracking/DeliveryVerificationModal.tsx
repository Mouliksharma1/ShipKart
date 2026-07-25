"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { updateTrackingStatusAction } from "@/app/actions/tracking";
import { BookingStatus } from "@prisma/client";

export function DeliveryVerificationModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [receiverName, setReceiverName] = useState(booking.receiverName || "");
  const [receiverPhone, setReceiverPhone] = useState(booking.receiverPhone || "");
  const [remarks, setRemarks] = useState("ID Verified. Parcel handed over to receiver.");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirmCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await updateTrackingStatusAction({
      lrNumber: booking.lrNumber,
      status: BookingStatus.COLLECTED,
      receiverNameVerified: receiverName,
      receiverPhoneVerified: receiverPhone,
      publicRemarks: `Parcel collected at counter by ${receiverName} (${receiverPhone}).`,
      internalRemarks: remarks,
    });

    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMsg(res.error || "Failed to confirm parcel collection.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-tight">
              Receiver Release Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold px-2 py-1 rounded text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between font-mono font-bold text-amber-400">
            <span>{booking.lrNumber}</span>
            <span>Total: ₹{booking.totalAmount} ({booking.paymentType})</span>
          </div>
          <p className="text-slate-300 font-semibold">
            Route: {booking.originOffice?.name} → {booking.destinationOffice?.name}
          </p>
        </div>

        <form onSubmit={handleConfirmCollection} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Receiver Name (ID Verified) *</label>
            <input
              type="text"
              required
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Receiver Phone Number *</label>
            <input
              type="text"
              required
              value={receiverPhone}
              onChange={(e) => setReceiverPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Verification Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-200"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Confirm Release & Mark Collected</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
