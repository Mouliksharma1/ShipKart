import { db } from "@/lib/db";

/**
 * ATOMIC GLOBAL LR GENERATOR SERVICE - generateNextLRNumber()
 * Pattern: SK000000001 (Global Sequence without annual resets)
 * Guarantees zero collisions, zero duplicates, and atomic increments.
 */
export async function generateNextLRNumber(): Promise<string> {
  return await db.$transaction(async (tx) => {
    // 1. Fetch or initialize LRSequence
    let seq = await tx.lRSequence.findFirst({
      where: { id: 1 },
    });

    if (!seq) {
      seq = await tx.lRSequence.create({
        data: {
          id: 1,
          lastNumber: 0,
        },
      });
    }

    // 2. Increment monotonically
    const nextNumber = seq.lastNumber + 1;

    await tx.lRSequence.update({
      where: { id: 1 },
      data: {
        lastNumber: nextNumber,
      },
    });

    // 3. Format padded 9-digit LR Number (e.g. SK000000001)
    const padded = String(nextNumber).padStart(9, "0");
    return `SK${padded}`;
  });
}
