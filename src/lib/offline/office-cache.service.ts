import { openDB } from "idb";

const DB_NAME = "ShipKartOfflineDB";

export interface CachedOffice {
  id: string;
  name: string;
  code: string;
  city: string;
  phone: string;
  address: string;
  updatedAt: string;
}

export async function cacheOfficeDirectory(offices: CachedOffice[]): Promise<void> {
  if (typeof window === "undefined" || !Array.isArray(offices)) return;
  try {
    const db = await openDB(DB_NAME, 1);
    const tx = db.transaction("cachedOffices", "readwrite");
    await Promise.all(offices.map((office) => tx.store.put(office)));
    await tx.done;
  } catch (err) {
    console.warn("[OfficeCache] Directory cache failed:", err);
  }
}

export async function getCachedOfficeDirectory(): Promise<CachedOffice[]> {
  if (typeof window === "undefined") return [];
  try {
    const db = await openDB(DB_NAME, 1);
    return await db.getAll("cachedOffices");
  } catch {
    return [];
  }
}
