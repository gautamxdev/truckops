/** Strip spaces, dashes and dots so "MH12AB4521", "mh 12 ab" and "MH-12-AB-4521" compare equal. */
export function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * True when a search query matches a registration plate, ignoring separators and case.
 * Queries with no letters or digits (e.g. just "-") never match.
 */
export function plateMatches(plate: string | undefined, query: string): boolean {
  if (!plate) return false
  const q = normalizePlate(query)
  if (!q) return false
  return normalizePlate(plate).includes(q)
}
