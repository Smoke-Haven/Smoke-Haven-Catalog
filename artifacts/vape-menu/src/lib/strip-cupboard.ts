/**
 * Removes cupboard indicators from puff counts
 * Examples:
 * "2K Puffs (3)" → "2K Puffs"
 * "Pro (F)" → "Pro"
 * "15K Puffs" → "15K Puffs" (unchanged if no cupboard)
 */
export function stripCupboardNumber(puffCount: string): string {
  if (!puffCount) return puffCount;
  // Remove anything in parentheses at the end: (1), (F), (3), etc.
  return puffCount.replace(/\s*\([^)]*\)\s*$/, '').trim();
}
