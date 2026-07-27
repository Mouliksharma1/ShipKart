/**
 * NORMALIZE LR NUMBER - Tolerant search helper
 *
 * Strips leading zeros so that all of these resolve to the same booking:
 *   "1", "01", "001", "0001"  →  "1"
 *
 * Non-numeric inputs (legacy SK... format, phone numbers) are returned unchanged.
 *
 * Usage:
 *   const normalized = normalizeLRNumber(userInput);
 *   booking.lrNumber.replace(/^0+/, "") === normalized
 */
export function normalizeLRNumber(value: string): string {
  const cleaned = value.trim();

  // Only normalize pure-digit strings; leave everything else (SK..., phones) untouched
  if (!/^\d+$/.test(cleaned)) {
    return cleaned;
  }

  const normalized = cleaned.replace(/^0+/, "");

  // "0000" → "0" (edge case safety)
  return normalized === "" ? "0" : normalized;
}
