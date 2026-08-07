import { openDB, DBSchema, IDBPDatabase } from "idb";

export interface PendingOfflineBooking {
  id?: number;
  tempId: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  originOfficeId: string;
  destinationOfficeId: string;
  packageType: string;
  weightCategory: string;
  declaredValue: number;
  paymentMode: string;
  amount: number;
  createdAt: string;
  status: "PENDING_SYNC" | "SYNCING" | "SYNC_FAILED";
  retryCount: number;
}

interface ShipKartOfflineDB extends DBSchema {
  pendingBookings: {
    key: number;
    value: PendingOfflineBooking;
    indexes: { "by-status": string; "by-tempId": string };
  };
  cachedTracking: {
    key: string; // LR Number or phone
    value: {
      lrNumber: string;
      data: any;
      cachedAt: string;
    };
  };
  cachedOffices: {
    key: string;
    value: {
      id: string;
      name: string;
      code: string;
      city: string;
      phone: string;
      address: string;
      updatedAt: string;
    };
  };
}

const DB_NAME = "ShipKartOfflineDB";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ShipKartOfflineDB>> | null = null;

function getDB(): Promise<IDBPDatabase<ShipKartOfflineDB>> {
  if (typeof window === "undefined") {
    return Promise.reject("IndexedDB not available server-side");
  }
  if (!dbPromise) {
    dbPromise = openDB<ShipKartOfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("pendingBookings")) {
          const store = db.createObjectStore("pendingBookings", {
            keyPath: "id",
            autoIncrement: true
          });
          store.createIndex("by-status", "status");
          store.createIndex("by-tempId", "tempId");
        }
        if (!db.objectStoreNames.contains("cachedTracking")) {
          db.createObjectStore("cachedTracking", { keyPath: "lrNumber" });
        }
        if (!db.objectStoreNames.contains("cachedOffices")) {
          db.createObjectStore("cachedOffices", { keyPath: "id" });
        }
      }
    });
  }
  return dbPromise;
}

/**
 * Queue a new booking while offline
 */
export async function queueOfflineBooking(
  bookingData: Omit<PendingOfflineBooking, "id" | "status" | "createdAt" | "retryCount">
): Promise<PendingOfflineBooking> {
  const db = await getDB();
  const entry: PendingOfflineBooking = {
    ...bookingData,
    status: "PENDING_SYNC",
    createdAt: new Date().toISOString(),
    retryCount: 0
  };
  const id = await db.add("pendingBookings", entry);
  return { ...entry, id };
}

/**
 * Retrieve all pending offline bookings
 */
export async function getPendingOfflineBookings(): Promise<PendingOfflineBooking[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex("pendingBookings", "by-status", "PENDING_SYNC");
  } catch {
    return [];
  }
}

/**
 * Remove booking after successful sync
 */
export async function removeOfflineBooking(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("pendingBookings", id);
}

/**
 * Clear all pending bookings
 */
export async function clearOfflineBookingQueue(): Promise<void> {
  const db = await getDB();
  await db.clear("pendingBookings");
}
