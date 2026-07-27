interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

/**
 * Get or compute cached values with TTL in seconds (default 120s / 2 mins)
 */
export async function getCached<T>(
  key: string,
  ttlSeconds: number = 120,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && cached.expiry > now) {
    return cached.data;
  }

  const freshData = await fetcher();
  memoryCache.set(key, {
    data: freshData,
    expiry: now + ttlSeconds * 1000,
  });

  return freshData;
}

export function invalidateCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.startsWith(keyPrefix)) {
      memoryCache.delete(key);
    }
  }
}
