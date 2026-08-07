"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export function InstallSuccess() {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleInstalled = () => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    };

    window.addEventListener("shipkart-pwa-installed", handleInstalled);
    return () => window.removeEventListener("shipkart-pwa-installed", handleInstalled);
  }, []);

  if (!showToast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
      <div className="rounded-2xl bg-emerald-600 text-white p-4 shadow-2xl flex items-center space-x-3.5 border border-emerald-400">
        <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
        <div>
          <h5 className="text-xs font-black uppercase tracking-wider text-emerald-100">Installation Complete</h5>
          <p className="text-xs font-bold">ShipKart installed successfully! Enjoy native experience.</p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="p-1 rounded-lg text-emerald-200 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
