"use client";

import React, { useState } from "react";
import { Search, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { BookingStatus, DelayReason, HoldReason } from "@prisma/client";
import { updateTrackingStatusAction } from "@/app/actions/tracking";
import { StatusBadge } from "@/components/tracking/StatusBadge";

export function LRScannerWidget({ onStatusUpdated }: { onStatusUpdated?: () => void }) {
  const [lrNumber, setLrNumber] = useState("");
  const [targetStatus, setTargetStatus] = useState<BookingStatus>(BookingStatus.RECEIVED_AT_ORIGIN);
  const [publicRemarks, setPublicRemarks] = useState("");
  const [internalRemarks, setInternalRemarks] = useState("");
  const [delayReason, setDelayReason] = useState<DelayReason | "">("");
  const [holdReason, setHoldReason] = useState<HoldReason | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lrNumber.trim()) return;

    setLoading(true);
    setMessage(null);

    const res = await updateTrackingStatusAction({
      lrNumber: lrNumber.trim().toUpperCase(),
      status: targetStatus,
      publicRemarks: publicRemarks || undefined,
      internalRemarks: internalRemarks || undefined,
      delayReason: delayReason ? (delayReason as DelayReason) : undefined,
      holdReason: holdReason ? (holdReason as HoldReason) : undefined,
    });

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Status updated successfully!" });
      setPublicRemarks("");
      setInternalRemarks("");
      if (onStatusUpdated) onStatusUpdated();
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update status." });
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            LR Scan & Instant Status Update
          </h2>
        </div>
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Hardware-Free Staff Scan
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">Enter LR Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. 0001"
              value={lrNumber}
              onChange={(e) => setLrNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white font-mono font-bold uppercase focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-neutral-300 font-bold mb-1">New Event Status *</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as BookingStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white font-bold focus:border-amber-500 focus:outline-none"
            >
              <option value="RECEIVED_AT_ORIGIN">RECEIVED AT ORIGIN OFFICE</option>
              <option value="SORTED">SORTED</option>
              <option value="LOADED">LOADED INTO BUS</option>
              <option value="IN_TRANSIT">IN TRANSIT</option>
              <option value="ARRIVED_AT_DESTINATION">ARRIVED AT DESTINATION OFFICE</option>
              <option value="UNLOADED">UNLOADED AT COUNTER</option>
              <option value="READY_FOR_COLLECTION">READY FOR COLLECTION</option>
              <option value="COLLECTED">COLLECTED BY RECEIVER</option>
              <option value="DELAYED">MARK DELAYED</option>
              <option value="HOLD">MARK ON HOLD</option>
            </select>
          </div>
        </div>

        {targetStatus === BookingStatus.DELAYED && (
          <div>
            <label className="block text-amber-600 dark:text-amber-400 font-bold mb-1">Delay Reason *</label>
            <select
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value as DelayReason)}
              className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold"
            >
              <option value="">Select Reason</option>
              <option value="TRAFFIC">TRAFFIC</option>
              <option value="VEHICLE_BREAKDOWN">VEHICLE BREAKDOWN</option>
              <option value="WEATHER">BAD WEATHER</option>
              <option value="ROAD_BLOCK">ROAD BLOCK</option>
              <option value="STRIKE">STRIKE / BANDH</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        )}

        {targetStatus === BookingStatus.HOLD && (
          <div>
            <label className="block text-amber-600 dark:text-amber-400 font-bold mb-1">Hold Reason *</label>
            <select
              value={holdReason}
              onChange={(e) => setHoldReason(e.target.value as HoldReason)}
              className="w-full px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold"
            >
              <option value="">Select Reason</option>
              <option value="DOCUMENT_PENDING">DOCUMENT PENDING</option>
              <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
              <option value="CUSTOMER_REQUEST">CUSTOMER REQUEST</option>
              <option value="DAMAGED_PARCEL">DAMAGED PARCEL</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-600 dark:text-neutral-400 font-medium mb-1">Public Remarks (Visible on QR Page)</label>
            <input
              type="text"
              placeholder="e.g. Parcel received safely at counter"
              value={publicRemarks}
              onChange={(e) => setPublicRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-neutral-400 font-medium mb-1">Internal Remarks (Staff Only)</label>
            <input
              type="text"
              placeholder="e.g. Upper shelf slot 4"
              value={internalRemarks}
              onChange={(e) => setInternalRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Confirm Status Event Update</span>
          </button>
        </div>
      </form>
    </div>
  );
}
