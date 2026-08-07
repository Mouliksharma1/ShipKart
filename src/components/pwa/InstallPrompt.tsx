"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running as PWA / standalone
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      window.dispatchEvent(new CustomEvent("shipkart-pwa-installed"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt || installed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl border-2 border-amber-500 bg-slate-900 text-white p-4 sm:p-5 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-xl">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 rounded-xl bg-amber-500 p-0.5 shrink-0 shadow-md">
            <img src="/shipkartLogo.png" alt="ShipKart App" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Install App</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h4 className="text-sm font-black text-white">Install ShipKart on Device</h4>
            <p className="text-[11px] text-slate-300 font-medium">Fast access, offline mode & native app feel.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
