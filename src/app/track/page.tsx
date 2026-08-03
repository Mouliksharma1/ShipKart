"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { customerTrackAction } from "@/app/actions/customer-track";
import {
  Package,
  Phone,
  Search,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";

function TrackFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLr = searchParams.get("lr") || "";

  const [lrNumber, setLrNumber] = useState(initialLr);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lrFromUrl = searchParams.get("lr");
    if (lrFromUrl) {
      setLrNumber(lrFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!lrNumber.trim()) {
      setError("Please enter your LR / Waybill Number");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter the Sender or Receiver Mobile Number");
      return;
    }

    setLoading(true);

    try {
      const res = await customerTrackAction(lrNumber, phone);
      if (res.success && (res.trackingId || res.lrNumber)) {
        router.push(`/track/${res.trackingId || res.lrNumber}`);
      } else {
        setError(res.error || "No matching consignment found");
      }
    } catch (err) {
      setError("Failed to track consignment. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0f] text-slate-900 dark:text-white flex flex-col justify-between p-3 sm:p-6 lg:p-8 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-600/5 dark:bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Track Section */}
      <main className="max-w-lg w-full mx-auto my-auto py-3 sm:py-6 relative z-10 space-y-4 sm:space-y-6">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">
            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Live Consignment Search</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Track Your Parcel
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-sm mx-auto px-2">
            Enter your LR / Consignment Number along with the registered Sender or Receiver phone number to verify and view live status.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/50 space-y-3.5 sm:space-y-5 relative transition-colors duration-200"
        >
          {error && (
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* LR Number Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider block flex items-center justify-between">
              <span>LR / Consignment Number</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">e.g. 0045, SK001</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                value={lrNumber}
                onChange={(e) => setLrNumber(e.target.value)}
                placeholder="Enter LR Number"
                className="w-full pl-10 sm:pl-12 pr-3.5 sm:pr-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                required
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-neutral-300 uppercase tracking-wider block flex items-center justify-between">
              <span>Sender / Receiver Mobile</span>
              <span className="text-[10px] text-slate-500 dark:text-neutral-500">10-Digit Mobile</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-neutral-500">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit Phone Number"
                className="w-full pl-10 sm:pl-12 pr-3.5 sm:pr-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-amber-950" />
                <span>Verifying & Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                <span>Track Consignment</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </>
            )}
          </button>

          <p className="text-[10px] sm:text-[11px] text-center text-slate-500 dark:text-neutral-500 pt-0.5">
            Verification required to protect customer privacy and parcel details.
          </p>
        </form>

        {/* Quick Info Badges */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 text-xs text-slate-600 dark:text-neutral-400 space-y-0.5 sm:space-y-1 shadow-sm dark:shadow-none">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 mx-auto" />
            <span className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs block">Real-Time Hub Tracking</span>
            <span className="text-[9px] sm:text-[10px]">Track exact office updates</span>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-neutral-800/80 text-xs text-slate-600 dark:text-neutral-400 space-y-0.5 sm:space-y-1 shadow-sm dark:shadow-none">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 mx-auto" />
            <span className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs block">Instant Status Alerts</span>
            <span className="text-[9px] sm:text-[10px]">SMS & WhatsApp Sync</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-2.5 sm:py-4 text-[11px] sm:text-xs text-slate-500 dark:text-neutral-500 relative z-10 border-t border-slate-200 dark:border-neutral-800/50">
        <p>
          POOJA TRAVELS & CARGO • Customer Service Helpline:{" "}
          <span className="text-slate-900 dark:text-white font-mono font-bold">6350603414</span> /{" "}
          <span className="text-slate-900 dark:text-white font-mono font-bold">7852091119</span>
        </p>
      </footer>
    </div>
  );
}

export default function CustomerTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0f] flex items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      }
    >
      <TrackFormContent />
    </Suspense>
  );
}
