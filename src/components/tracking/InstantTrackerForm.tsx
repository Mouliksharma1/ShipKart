"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export function InstantTrackerForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;

    if (clean.startsWith("SK")) {
      router.push(`/track/${clean}`);
    } else {
      router.push(`/employee/bookings?search=${encodeURIComponent(clean)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">
          Enter LR Number or Sender Mobile
        </label>
        <input
          type="text"
          required
          placeholder="e.g. SK000000001 or 6350603414"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 py-3 px-4 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
  );
}
