"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Package, Truck, Sparkles } from "lucide-react";

export function InstantTrackerForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"track" | "book">("track");
  const [query, setQuery] = useState("");

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    router.push(`/track?lr=${encodeURIComponent(clean)}`);
  };

  const handleBookRedirect = () => {
    router.push("/customer/book");
  };

  return (
    <div className="space-y-5">
      {/* INTERACTIVE TAB SWITCHER */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 dark:bg-neutral-950 p-1 border border-slate-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setActiveTab("track")}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "track"
              ? "bg-amber-500 text-amber-950 shadow-md scale-[1.02]"
              : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-900"
          }`}
        >
          <Search className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Track LR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("book")}
          className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "book"
              ? "bg-amber-500 text-amber-950 shadow-md scale-[1.02]"
              : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-900"
          }`}
        >
          <Package className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Book Parcel</span>
        </button>
      </div>

      {/* TRACK TAB CONTENT */}
      {activeTab === "track" && (
        <form onSubmit={handleTrackSubmit} className="space-y-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
              Enter LR Number or Sender Mobile
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 0001 or 6350603414"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-3 px-4 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] py-3 text-xs font-black text-amber-950 shadow-md transition-all cursor-pointer"
          >
            <span>Track Consignment Status</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </button>
        </form>
      )}

      {/* BOOK TAB CONTENT */}
      {activeTab === "book" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>EXPRESS PARCEL DISPATCH</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                FROM ₹99
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-300 leading-snug">
              Direct bus freight across Rajasthan & interstate. Instant digital LR generation and safe station pickups.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBookRedirect}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] py-3 text-xs font-black text-amber-950 shadow-md transition-all cursor-pointer"
          >
            <Package className="h-4 w-4 stroke-[2.5]" />
            <span>Proceed to Online Booking</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
}
