"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showToast && isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300 pointer-events-none">
      <div
        className={`pointer-events-auto px-4 py-2 rounded-full text-xs font-black shadow-xl flex items-center space-x-2 border transition-all ${
          isOnline
            ? "bg-emerald-600 text-white border-emerald-400"
            : "bg-red-600 text-white border-red-400"
        }`}
      >
        {isOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-100"></span>
            </span>
            <Wifi className="w-3.5 h-3.5" />
            <span>Connection Restored (Online)</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-100"></span>
            </span>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode Active</span>
          </>
        )}
      </div>
    </div>
  );
}
