"use client";

import React, { useState, useEffect } from "react";
import { getPendingOfflineBookings } from "@/lib/offline/offline-booking.service";
import { CloudOff, RefreshCw } from "lucide-react";
import { syncPendingOfflineData } from "@/lib/offline/background-sync.service";

export function OfflineQueueIndicator() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const checkQueue = async () => {
    const pending = await getPendingOfflineBookings();
    setPendingCount(pending.length);
  };

  useEffect(() => {
    checkQueue();
    const interval = setInterval(checkQueue, 5000);

    const handleOnline = async () => {
      setIsSyncing(true);
      await syncPendingOfflineData();
      await checkQueue();
      setIsSyncing(false);
    };

    window.addEventListener("online", handleOnline);
    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const handleManualSync = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    await syncPendingOfflineData();
    await checkQueue();
    setIsSyncing(false);
  };

  if (pendingCount === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl bg-amber-500 text-amber-950 px-4 py-2.5 shadow-xl border border-amber-400 flex items-center space-x-3 text-xs font-black">
        <CloudOff className="w-4 h-4 shrink-0" />
        <div>
          <span>Pending Offline Queue ({pendingCount})</span>
        </div>
        {navigator.onLine && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1 rounded-lg bg-amber-600 text-amber-950 hover:bg-amber-700 transition-colors"
            title="Sync Now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
}
