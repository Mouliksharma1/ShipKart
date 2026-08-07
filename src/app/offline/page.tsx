"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home, CheckCircle2, ShieldCheck, MapPin, Search } from "lucide-react";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = "/";
      } else {
        setIsRetrying(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 transition-colors duration-300">
      <div className="w-full max-w-lg rounded-3xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 sm:p-10 shadow-2xl text-center space-y-6">
        
        {/* Offline Icon Illustration */}
        <div className="relative w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/30 shadow-lg">
          <WifiOff className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
            {isOnline ? "Connection Restored!" : "Offline Mode Active"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isOnline ? "You are Back Online!" : "No Internet Connection"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 font-medium max-w-md mx-auto leading-relaxed">
            {isOnline
              ? "Your internet connection is restored. Click retry or head home to continue."
              : "Don't worry! ShipKart is equipped with offline caching so you can keep working."}
          </p>
        </div>

        {/* Offline Features List */}
        {!isOnline && (
          <div className="rounded-2xl bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800 p-4 text-left space-y-2.5">
            <h2 className="text-xs font-black text-slate-700 dark:text-neutral-300 uppercase tracking-wide border-b border-slate-200 dark:border-neutral-800 pb-2">
              Available Offline Features
            </h2>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-neutral-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>View cached consignment tracking history</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>View previously opened digital LR builty pages</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Browse station branch offices & directory contacts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Stage offline bookings (auto-sync when back online)</span>
              </li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 px-6 py-3.5 text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Reconnecting..." : "Retry Connection"}</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-slate-800 dark:text-neutral-200 px-6 py-3.5 text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all"
          >
            <Home className="w-4 h-4 text-amber-500" />
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
