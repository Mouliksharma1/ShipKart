import { db } from "@/lib/db";

export interface DatabaseHealthResult {
  connected: boolean;
  connectedText: "Yes" | "No";
  responseTimeMs: number;
  status: "HEALTHY" | "DEGRADED" | "DISCONNECTED";
  prismaStatus: "Connected" | "Disconnected";
  timestamp: string;
}

/**
 * Lightweight Database Health & Latency Check
 * Executes a simple `SELECT 1` raw query to measure connection status & response time.
 */
export async function getDatabaseHealth(): Promise<DatabaseHealthResult> {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  try {
    // Lightweight SELECT 1 ping query
    await db.$queryRaw`SELECT 1`;
    const responseTimeMs = Math.round(performance.now() - startTime);

    let status: "HEALTHY" | "DEGRADED" | "DISCONNECTED" = "HEALTHY";
    if (responseTimeMs > 250) {
      status = "DEGRADED";
    }

    return {
      connected: true,
      connectedText: "Yes",
      responseTimeMs,
      status,
      prismaStatus: "Connected",
      timestamp,
    };
  } catch (err: any) {
    console.error("Database Health Check Failed:", err);
    return {
      connected: false,
      connectedText: "No",
      responseTimeMs: 0,
      status: "DISCONNECTED",
      prismaStatus: "Disconnected",
      timestamp,
    };
  }
}
