import { processQueue } from '@/lib/services/notification';

export async function runNotificationWorkerBatch() {
  const workerId = `worker_${process.pid || 'node'}_${Date.now()}`;
  try {
    const result = await processQueue(workerId, 50);
    return result;
  } catch (error) {
    console.error(`[Worker ${workerId}] Batch execution failed:`, error);
    return { processed: 0, successes: 0, failures: 0, error: String(error) };
  }
}
