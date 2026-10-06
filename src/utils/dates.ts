/** Calendar "today" in India — avoids UTC midnight skew for IST fleets. */
export function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function isExpired(isoDate: string, today = todayIso()): boolean {
  return isoDate < today
}

/** Whole calendar days from today until an ISO date (negative once it has passed). */
export function daysUntil(isoDate: string, today = todayIso()): number {
  const due = new Date(`${isoDate}T00:00:00`)
  const now = new Date(`${today}T00:00:00`)
  return Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/** Short countdown label for document expiry pills, e.g. "today", "in 3d". */
export function dueInLabel(isoDate: string, today = todayIso()): string {
  const days = daysUntil(isoDate, today)
  if (days <= 0) return 'today'
  if (days === 1) return 'tomorrow'
  return `in ${days}d`
}

export function isDueSoon(
  isoDate: string,
  today = todayIso(),
  withinDays = 45,
): boolean {
  if (isoDate < today) return false
  return daysUntil(isoDate, today) <= withinDays
}

/** Display an ISO date (YYYY-MM-DD) in en-IN style, e.g. 23 Sept 2026. */
export function formatDateIn(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(d.getTime())) return isoDate
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}
