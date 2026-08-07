import { getPendingOfflineBookings, removeOfflineBooking } from "./offline-booking.service";

export interface SyncResult {
  syncedCount: number;
  failedCount: number;
  errors: string[];
}

/**
 * Synchronizes all pending offline bookings with the backend when connection is restored.
 */
export async function syncPendingOfflineData(): Promise<SyncResult> {
  const result: SyncResult = { syncedCount: 0, failedCount: 0, errors: [] };

  if (typeof window === "undefined" || !navigator.onLine) {
    return result;
  }

  try {
    const pendingBookings = await getPendingOfflineBookings();
    if (pendingBookings.length === 0) {
      return result;
    }

    for (const booking of pendingBookings) {
      if (!booking.id) continue;

      try {
        // Attempt posting to booking API or server action
        const response = await fetch("/api/booking/offline-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking)
        });

        if (response.ok) {
          await removeOfflineBooking(booking.id);
          result.syncedCount++;
        } else {
          result.failedCount++;
          result.errors.push(`Failed to sync booking tempId ${booking.tempId}`);
        }
      } catch (err: any) {
        result.failedCount++;
        result.errors.push(err?.message || `Sync failed for booking tempId ${booking.tempId}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Background sync error: ${err?.message}`);
  }

  return result;
}

/**
 * Register automatic background sync listeners on network online events
 */
export function setupBackgroundSyncListeners(onSyncComplete?: (res: SyncResult) => void) {
  if (typeof window === "undefined") return;

  const handleOnline = async () => {
    console.log("[BackgroundSync] Network restored. Synchronizing offline data...");
    const res = await syncPendingOfflineData();
    if (onSyncComplete && (res.syncedCount > 0 || res.failedCount > 0)) {
      onSyncComplete(res);
    }
  };

  window.addEventListener("online", handleOnline);

  return () => {
    window.removeEventListener("online", handleOnline);
  };
}
