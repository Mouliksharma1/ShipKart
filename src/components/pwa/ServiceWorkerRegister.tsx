"use client";

import { useEffect } from "react";
import { setupBackgroundSyncListeners } from "@/lib/offline/background-sync.service";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered with scope:", registration.scope);

        // Check for updates on register
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
              console.log("[PWA] New version available! Dispatching update event.");
              window.dispatchEvent(new CustomEvent("shipkart-pwa-update-available"));
            }
          };
        };
      })
      .catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err);
      });

    // Setup auto background sync when online
    const cleanupSync = setupBackgroundSyncListeners((res) => {
      console.log(`[PWA Sync] Auto-synced ${res.syncedCount} offline records.`);
    });

    return () => {
      if (cleanupSync) cleanupSync();
    };
  }, []);

  return null;
}
