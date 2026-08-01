import { db } from "@/lib/db";

export interface CleanupResult {
  success: boolean;
  otpsRemoved: number;
  notificationsRemoved: number;
  cacheRecordsRemoved: number;
  timestamp: string;
}

/**
 * Clean up expired Collection OTP records where expiresAt < now
 */
export async function cleanupExpiredCollectionOTP(): Promise<number> {
  try {
    const result = await db.collectionOTP.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  } catch (err) {
    console.error("Cleanup Expired Collection OTP Error:", err);
    return 0;
  }
}

/**
 * Clean up processed/finished notification queue records (SENT, FAILED, CANCELLED, DEAD_LETTER)
 */
export async function cleanupProcessedNotifications(): Promise<number> {
  try {
    const result = await db.notificationQueue.deleteMany({
      where: {
        status: {
          in: ["SENT", "FAILED", "CANCELLED", "DEAD_LETTER"],
        },
      },
    });
    return result.count;
  } catch (err) {
    console.error("Cleanup Processed Notifications Error:", err);
    return 0;
  }
}

/**
 * Clean up expired report cache entries where expiresAt < now
 */
export async function cleanupExpiredReportCache(): Promise<number> {
  try {
    const result = await db.reportCache.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  } catch (err) {
    console.error("Cleanup Expired Report Cache Error:", err);
    return 0;
  }
}

/**
 * Execute all system cleanup tasks sequentially and log activity
 */
export async function runFullSystemCleanup(userId?: string): Promise<CleanupResult> {
  const otpsRemoved = await cleanupExpiredCollectionOTP();
  const notificationsRemoved = await cleanupProcessedNotifications();
  const cacheRecordsRemoved = await cleanupExpiredReportCache();
  const timestamp = new Date().toISOString();

  // Audit activity log
  try {
    await db.activityLog.create({
      data: {
        userId: userId || null,
        module: "SYSTEM_CLEANUP",
        entity: "SystemCleanup",
        action: `Manual System Cleanup Executed: ${otpsRemoved} OTPs, ${notificationsRemoved} Notifications, ${cacheRecordsRemoved} Cache Records purged.`,
      },
    });
  } catch (logErr) {
    console.warn("Failed to record system cleanup activity log:", logErr);
  }

  return {
    success: true,
    otpsRemoved,
    notificationsRemoved,
    cacheRecordsRemoved,
    timestamp,
  };
}
