"use client";

import React, { useState } from "react";
import { cleanupSystemAction } from "@/app/actions/admin/cleanup";
import { Trash2, Loader2, CheckCircle2, AlertTriangle, RefreshCw, HardDriveDownload } from "lucide-react";

interface CleanupData {
  otpsRemoved: number;
  notificationsRemoved: number;
  cacheRecordsRemoved: number;
  timestamp: string;
}

export function SystemCleanupCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CleanupData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCleanup = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await cleanupSystemAction();

      if (!res.success) {
        setErrorMsg(res.error || "System cleanup failed.");
      } else if (res.data) {
        setResult(res.data);
        setSuccessMsg("System maintenance cleanup completed successfully!");
      }
    } catch (err: any) {
      console.error("Cleanup error:", err);
      setErrorMsg("An unexpected error occurred during cleanup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/20">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              System Maintenance & Cleanup
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Purge expired OTPs, sent notifications, and temporary report cache entries
            </p>
          </div>
        </div>

        <button
          onClick={handleCleanup}
          disabled={loading}
          className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 active:scale-95 text-white text-xs font-black px-4 py-2.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cleaning Up...</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Run System Cleanup</span>
            </>
          )}
        </button>
      </div>

      {/* ERROR ALERT */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SUCCESS ALERT */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* RESULTS BREAKDOWN DISPLAY */}
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              OTPs Removed
            </span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
              {result.otpsRemoved}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Notifications Removed
            </span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
              {result.notificationsRemoved}
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/60 dark:border-zinc-800 text-center space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Cache Records Removed
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
              {result.cacheRecordsRemoved}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
