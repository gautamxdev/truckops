/** Kilometres between scheduled services for the fleet. */
export const SERVICE_INTERVAL_KM = 10000

interface ServiceReading {
  odometerKm: number
  lastServiceKm: number
}

/** Km driven since the last service (never negative if the odometer was reset). */
export function kmSinceService(t: ServiceReading): number {
  return Math.max(0, t.odometerKm - t.lastServiceKm)
}

/** Km remaining until the next service (negative once overdue). */
export function kmUntilService(t: ServiceReading): number {
  return SERVICE_INTERVAL_KM - kmSinceService(t)
}

export function needsService(t: ServiceReading): boolean {
  return kmSinceService(t) >= SERVICE_INTERVAL_KM
}
