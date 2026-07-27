import { prisma } from '@/lib/db';

export type SequenceKey = 'OFF' | 'EMP' | 'VEH' | 'ROUTE' | 'PRICE' | 'ACT';

const PREFIX_MAP: Record<SequenceKey, string> = {
  OFF: 'OFF',
  EMP: 'EMP',
  VEH: 'VEH',
  ROUTE: 'ROUTE',
  PRICE: 'PRICE',
  ACT: 'ACT',
};

/**
 * Generate a thread-safe sequential ID (e.g. OFF000001, EMP000001, ACT000001)
 */
export async function generateSequentialNumber(key: SequenceKey): Promise<string> {
  const prefix = PREFIX_MAP[key] || key;
  
  const seq = await prisma.sequenceMaster.upsert({
    where: { key },
    update: { lastNumber: { increment: 1 } },
    create: { key, lastNumber: 1 },
  });

  const paddedNumber = String(seq.lastNumber).padStart(6, '0');
  return `${prefix}${paddedNumber}`;
}
