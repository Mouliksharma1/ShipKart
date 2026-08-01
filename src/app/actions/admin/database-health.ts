"use server";

import { getDatabaseHealth, DatabaseHealthResult } from "@/lib/services/system/database-health.service";

/**
 * SERVER ACTION: GET DATABASE HEALTH
 * Executes lightweight `SELECT 1` ping query and returns connection status & latency.
 */
export async function getDatabaseHealthAction(): Promise<{
  success: boolean;
  data?: DatabaseHealthResult;
  error?: string;
}> {
  try {
    const data = await getDatabaseHealth();
    return { success: true, data };
  } catch (err: any) {
    console.error("Database Health Action Error:", err);
    return {
      success: false,
      error: `Failed to fetch database health: ${err?.message || String(err)}`,
    };
  }
}
