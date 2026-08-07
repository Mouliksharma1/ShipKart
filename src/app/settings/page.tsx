"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  Trash2,
  CloudUpload,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { getPendingOfflineBookings, clearOfflineBookingQueue } from "@/lib/offline/offline-booking.service";
import { syncPendingOfflineData } from "@/lib/offline/background-sync.service";

export default function PWASettingsPage() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [cacheSize, setCacheSize] = useState<string>("Calculated on demand");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      );
      setIsOnline(navigator.onLine);

      getPendingOfflineBookings().then((bookings) => {
        setPendingQueueCount(bookings.length);
      });

      const handleStatus = () => setIsOnline(navigator.onLine);
      window.addEventListener("online", handleStatus);
      window.addEventListener("offline", handleStatus);

      return () => {
        window.removeEventListener("online", handleStatus);
        window.removeEventListener("offline", handleStatus);
      };
    }
  }, []);

  const handleCheckUpdates = async () => {
    setStatusMsg("Checking for application updates...");
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.update();
        setStatusMsg("Service worker updated. If a new version is available, an update toast will appear.");
      } else {
        setStatusMsg("Service worker registration active.");
      }
    } else {
      setStatusMsg("Service Worker is not supported in this browser.");
    }
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handleClearCache = async () => {
    setStatusMsg("Clearing offline application cache...");
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await clearOfflineBookingQueue();
      setPendingQueueCount(0);
      setStatusMsg("Cache cleared successfully! Reloading...");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleSyncData = async () => {
    if (!navigator.onLine) {
      setStatusMsg("Cannot sync while offline. Please connect to the internet.");
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }
    setIsSyncing(true);
    setStatusMsg("Synchronizing pending offline bookings...");
    const result = await syncPendingOfflineData();
    setIsSyncing(false);

    const remaining = await getPendingOfflineBookings();
    setPendingQueueCount(remaining.length);

    setStatusMsg(`Sync Complete: ${result.syncedCount} records uploaded successfully.`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">
              <Smartphone className="w-3.5 h-3.5" />
              <span>PROGRESSIVE WEB APP SETTINGS</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              PWA & Offline Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 font-medium mt-1">
              Manage application caching, offline pending queue, update checks, and PWA status.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-neutral-300 hover:text-amber-500 transition-colors bg-white dark:bg-neutral-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Notification Status Alert */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold shadow-md flex items-center space-x-3 animate-in fade-in duration-200">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* PWA Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status 1: App Installation */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400">Installation</span>
              <Smartphone className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {isStandalone ? "Installed (PWA App)" : "Browser Window"}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
              {isStandalone ? "Running in standalone PWA window" : "Install via install prompt"}
            </p>
          </div>

          {/* Status 2: Network Connectivity */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400">Network Status</span>
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
            </div>
            <div className={`text-base font-black ${isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {isOnline ? "🟢 Online" : "🔴 Offline Mode"}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
              {isOnline ? "Live network active" : "Offline caching active"}
            </p>
          </div>

          {/* Status 3: Cache Version */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400">Cache Version</span>
              <HardDrive className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              shipkart-v1.0.0
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
              Smart Service Worker cache
            </p>
          </div>

          {/* Status 4: Pending Offline Queue */}
          <div className="rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-400">Pending Sync Queue</span>
              <CloudUpload className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              {pendingQueueCount} Records
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">
              Staged offline bookings
            </p>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-200 dark:border-neutral-800 pb-4">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              PWA Management & Diagnostics
            </h2>
            <p className="text-xs text-slate-600 dark:text-neutral-400 font-medium mt-1">
              Perform manual cache cleanup, trigger background sync, or check for new application deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={handleCheckUpdates}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 hover:border-amber-500 text-center space-y-2 transition-all cursor-pointer group active:scale-95"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">Check for Updates</span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Scan service worker updates</span>
            </button>

            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 hover:border-emerald-500 text-center space-y-2 transition-all cursor-pointer group active:scale-95 disabled:opacity-50"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <CloudUpload className={`w-6 h-6 ${isSyncing ? "animate-bounce" : ""}`} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">Sync Pending Data</span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Upload offline bookings</span>
            </button>

            <button
              onClick={handleClearCache}
              className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-950 hover:border-red-500 text-center space-y-2 transition-all cursor-pointer group active:scale-95"
            >
              <div className="p-3 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                <Trash2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">Clear Cache</span>
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Purge static assets & SW cache</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-1 text-xs text-slate-500 dark:text-neutral-500 font-medium">
          <p>ShipKart Progressive Web App Engine • Version 1.0.0</p>
          <p>Powered by POOJA TRAVELS & CARGO</p>
        </div>

      </div>
    </div>
  );
}
