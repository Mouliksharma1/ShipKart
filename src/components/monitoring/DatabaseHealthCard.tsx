"use client";

import React, { useState, useEffect } from "react";
import { getDatabaseHealthAction } from "@/app/actions/admin/database-health";
import { DatabaseHealthResult } from "@/lib/services/system/database-health.service";
import { Database, RefreshCcw } from "lucide-react";

export function DatabaseHealthCard() {
  const [data, setData] = useState<DatabaseHealthResult | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await getDatabaseHealthAction();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Database Health fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const isConnected = data?.connected ?? false;
  const responseTime = data?.responseTimeMs ?? 0;
  const status = data?.status ?? "DISCONNECTED";

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Database Health & Latency
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Real-time PostgreSQL ping response time & connection status
            </p>
          </div>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition cursor-pointer disabled:opacity-50"
          title="Refresh Database Health"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin text-amber-500" : ""}`} />
        </button>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* CONNECTED */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block">
            Database Connected
          </span>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            <span
              className={`text-lg font-black ${
                isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {data?.connectedText || "No"}
            </span>
          </div>
        </div>

        {/* RESPONSE TIME */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block">
            Response Time
          </span>
          <span
            className={`text-lg font-black block pt-0.5 font-mono ${
              responseTime < 150
                ? "text-emerald-600 dark:text-emerald-400"
                : responseTime < 300
                ? "text-amber-600 dark:text-amber-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {responseTime} ms
          </span>
        </div>

        {/* PRISMA STATUS */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block">
            Prisma Status
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white block pt-0.5">
            {data?.prismaStatus || "Disconnected"}
          </span>
        </div>

        {/* HEALTH STATUS */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400 block">
            System Status
          </span>
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border mt-1 ${
              status === "HEALTHY"
                ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : status === "DEGRADED"
                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
