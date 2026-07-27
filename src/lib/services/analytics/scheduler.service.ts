import { prisma } from '@/lib/db';

export async function getCachedReport(reportType: string, filters: Record<string, any>) {
  try {
    const cache = await prisma.reportCache.findFirst({
      where: {
        reportType,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (cache) {
      return cache.data;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function setCachedReport(reportType: string, filters: Record<string, any>, data: any, generatedBy: string = 'System', ttlMinutes: number = 30) {
  try {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    await prisma.reportCache.create({
      data: {
        reportType,
        filters,
        generatedBy,
        data,
        expiresAt,
      },
    });
  } catch (err) {
    console.warn('Failed to cache report:', err);
  }
}
