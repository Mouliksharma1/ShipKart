"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Sparkles, X } from "lucide-react";

export function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setUpdateAvailable(true);
    };

    window.addEventListener("shipkart-pwa-update-available", handleUpdate);
    return () => window.removeEventListener("shipkart-pwa-update-available", handleUpdate);
  }, []);

  const handleUpdateClick = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl border-2 border-amber-500 bg-slate-900 text-white p-5 shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500 text-amber-950 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">New Version Available</span>
              <h4 className="text-sm font-black text-white">ShipKart Update Ready</h4>
            </div>
          </div>
          <button
            onClick={() => setUpdateAvailable(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-300 space-y-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <p className="font-bold text-white">What's New in this update:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
            <li>Faster parcel tracking & LR retrieval</li>
            <li>Performance optimizations & offline enhancements</li>
            <li>Bug fixes & enhanced UI responsiveness</li>
          </ul>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={handleUpdateClick}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 px-5 py-2.5 text-xs font-black shadow-md transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update Now</span>
          </button>
          <button
            onClick={() => setUpdateAvailable(false)}
            className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
