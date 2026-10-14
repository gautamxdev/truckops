import { Truck, Users, MapPinned, IndianRupee, Fuel, AlertTriangle } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import {
  drivers,
  financeSummary,
  formatInr,
  trips,
  trucks,
  truckById,
  driverById,
} from '../data/mock'
import type { Trip, Truck as FleetTruck } from '../types'
import { daysUntil, formatDateIn, isDueSoon, isExpired, overdueByLabel, todayIso } from '../utils/dates'

const SERVICE_INTERVAL_KM = 10000

function kmSinceService(t: FleetTruck) {
  return Math.max(0, t.odometerKm - t.lastServiceKm)
}

function needsService(t: FleetTruck) {
  return kmSinceService(t) >= SERVICE_INTERVAL_KM
}

function isEtaOverdue(trip: Trip, today = todayIso()) {
  return (
    (trip.status === 'in_transit' || trip.status === 'planned') &&
    trip.etaDate < today
  )
}

type DocAlert = {
  id: string
  label: string
  kind: 'fitness' | 'insurance' | 'service' | 'licence'
  detail: string
  severity: 'expired' | 'soon' | 'service'
  /** Orders alerts within a severity: oldest/nearest date first, or most km overdue first. */
  sortKey: number
}

export default function Dashboard() {
  const onTrip = trucks.filter((t) => t.status === 'on_trip').length
  const available = trucks.filter((t) => t.status === 'available').length
  // Soonest ETA first so overdue and arriving-today trips sit at the top.
  const activeTrips = trips
    .filter((t) => t.status === 'in_transit' || t.status === 'planned')
    .sort((a, b) => a.etaDate.localeCompare(b.etaDate))
  const overdueEtaCount = activeTrips.filter((t) => isEtaOverdue(t)).length

  const docAlerts: DocAlert[] = []
  for (const t of trucks) {
    if (isExpired(t.fitnessExpiry)) {
      docAlerts.push({
        id: `${t.id}-fitness`,
        label: t.plate,
        kind: 'fitness',
        detail: `fitness expired ${formatDateIn(t.fitnessExpiry)}`,
        severity: 'expired',
        sortKey: daysUntil(t.fitnessExpiry),
      })
    } else if (isDueSoon(t.fitnessExpiry)) {
      docAlerts.push({
        id: `${t.id}-fitness`,
        label: t.plate,
        kind: 'fitness',
        detail: `fitness due ${formatDateIn(t.fitnessExpiry)}`,
        severity: 'soon',
        sortKey: daysUntil(t.fitnessExpiry),
      })
    }
    if (isExpired(t.insuranceExpiry)) {
      docAlerts.push({
        id: `${t.id}-insurance`,
        label: t.plate,
        kind: 'insurance',
        detail: `insurance expired ${formatDateIn(t.insuranceExpiry)}`,
        severity: 'expired',
        sortKey: daysUntil(t.insuranceExpiry),
      })
    } else if (isDueSoon(t.insuranceExpiry)) {
      docAlerts.push({
        id: `${t.id}-insurance`,
        label: t.plate,
        kind: 'insurance',
        detail: `insurance due ${formatDateIn(t.insuranceExpiry)}`,
        severity: 'soon',
        sortKey: daysUntil(t.insuranceExpiry),
      })
    }
    if (needsService(t)) {
      docAlerts.push({
        id: `${t.id}-service`,
        label: t.plate,
        kind: 'service',
        detail: `${kmSinceService(t).toLocaleString('en-IN')} km since service`,
        severity: 'service',
        sortKey: -kmSinceService(t),
      })
    }
  }

  for (const d of drivers) {
    if (isExpired(d.licenceExpiry)) {
      docAlerts.push({
        id: `${d.id}-licence`,
        label: d.name,
        kind: 'licence',
        detail: `licence expired ${formatDateIn(d.licenceExpiry)}`,
        severity: 'expired',
        sortKey: daysUntil(d.licenceExpiry),
      })
    } else if (isDueSoon(d.licenceExpiry)) {
      docAlerts.push({
        id: `${d.id}-licence`,
        label: d.name,
        kind: 'licence',
        detail: `licence due ${formatDateIn(d.licenceExpiry)}`,
        severity: 'soon',
        sortKey: daysUntil(d.licenceExpiry),
      })
    }
  }

  docAlerts.sort((a, b) => {
    const rank = { expired: 0, soon: 1, service: 2 }
    return rank[a.severity] - rank[b.severity] || a.sortKey - b.sortKey
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Snapshot of fleet, trips, and cash for {financeSummary.monthLabel}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Trucks on road"
          value={`${onTrip} / ${trucks.length}`}
          hint={`${available} available`}
          icon={Truck}
        />
        <StatCard
          label="Drivers rostered"
          value={String(drivers.length)}
          hint={`${drivers.filter((d) => d.status === 'on_trip').length} on trip`}
          icon={Users}
        />
        <StatCard
          label="Active trips"
          value={String(activeTrips.length)}
          hint="Planned + in transit"
          icon={MapPinned}
        />
        <StatCard
          label="Month net"
          value={formatInr(financeSummary.netInr)}
          hint={`Revenue ${formatInr(financeSummary.revenueInr)}`}
          icon={IndianRupee}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h2 className="font-display font-semibold text-slate-900">Live trips</h2>
            <span className="text-xs text-slate-500">
              {activeTrips.length} open
              {overdueEtaCount > 0 ? (
                <span className="ml-1 font-medium text-red-600">
                  · {overdueEtaCount} overdue ETA{overdueEtaCount === 1 ? '' : 's'}
                </span>
              ) : null}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {activeTrips.map((trip) => {
              const truck = truckById(trip.truckId)
              const driver = driverById(trip.driverId)
              const overdue = isEtaOverdue(trip)
              return (
                <div
                  key={trip.id}
                  className={`px-5 py-4 flex flex-wrap items-center gap-3 justify-between ${
                    overdue ? 'bg-red-50/60' : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">
                        {trip.origin} → {trip.destination}
                      </p>
                      {overdue ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          ETA {overdueByLabel(trip.etaDate)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {truck?.plate} · {driver?.name} · {trip.cargo}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        overdue ? 'text-red-700 font-medium' : 'text-slate-400'
                      }`}
                    >
                      ETA {formatDateIn(trip.etaDate)}
                      {overdue ? (
                        <span className="sr-only"> (ETA {overdueByLabel(trip.etaDate)})</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                      {formatInr(trip.freightInr)}
                    </span>
                    <StatusBadge status={trip.status} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center gap-2 text-amber-700 mb-3">
              <Fuel className="h-4 w-4" />
              <h2 className="font-display font-semibold text-sm">Diesel & toll burn</h2>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Diesel</dt>
                <dd className="font-medium">{formatInr(financeSummary.dieselInr)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">FASTag / toll</dt>
                <dd className="font-medium">{formatInr(financeSummary.tollInr)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <dt className="text-slate-500">Other ops</dt>
                <dd className="font-medium">{formatInr(financeSummary.otherExpenseInr)}</dd>
              </div>
            </dl>
          </div>

          {docAlerts.length > 0 ? (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center gap-2 text-orange-800 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <h2 className="font-display font-semibold text-sm">
                  Docs, licences & service
                </h2>
              </div>
              <ul className="space-y-1.5 text-sm text-orange-900/80">
                {docAlerts.map((a) => (
                  <li key={a.id}>
                    <span
                      className={
                        a.severity === 'expired' ? 'font-semibold text-red-800' : undefined
                      }
                    >
                      {a.label}
                    </span>{' '}
                    — {a.detail}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
