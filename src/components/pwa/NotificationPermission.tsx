"use client";

import React, { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";

export function NotificationPermission() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    if (Notification.permission === "default") {
      const timer = setTimeout(() => setShowPrompt(true), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("[PWA Notifications] Permission granted.");
      }
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 right-6 max-w-sm z-50 animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl border-2 border-amber-500 bg-slate-900 text-white p-4 shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-amber-950 font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-black uppercase text-amber-400">Parcel Notifications</h5>
              <p className="text-xs font-bold text-white">Enable Push Updates</p>
            </div>
          </div>
          <button onClick={() => setShowPrompt(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
          Receive real-time parcel dispatch, station arrival, and OTP pickup alerts directly on your device.
        </p>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={handleAllow}
            className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 px-4 py-2 text-xs font-black shadow-md transition-all active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Allow Notifications</span>
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
