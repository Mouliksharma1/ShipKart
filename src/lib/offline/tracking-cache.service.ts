import { openDB } from "idb";

const DB_NAME = "ShipKartOfflineDB";

export async function cacheTrackingResult(lrNumber: string, trackingData: any): Promise<void> {
  if (typeof window === "undefined" || !lrNumber) return;
  try {
    const db = await openDB(DB_NAME, 1);
    await db.put("cachedTracking", {
      lrNumber: lrNumber.trim().toLowerCase(),
      data: trackingData,
      cachedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn("[TrackingCache] Cache put failed:", err);
  }
}

export async function getCachedTrackingResult(lrNumber: string): Promise<any | null> {
  if (typeof window === "undefined" || !lrNumber) return null;
  try {
    const db = await openDB(DB_NAME, 1);
    const entry = await db.get("cachedTracking", lrNumber.trim().toLowerCase());
    return entry ? entry.data : null;
  } catch {
    return null;
  }
}
