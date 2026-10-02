import { useMemo, useState } from 'react'
import { AlertTriangle, Search } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { driverById, formatInr, trips, truckById } from '../data/mock'
import type { Trip, TripStatus } from '../types'

import { todayIso } from '../utils/dates'

const STATUS_FILTERS: { id: 'all' | TripStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'planned', label: 'Planned' },
  { id: 'in_transit', label: 'In transit' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'settled', label: 'Settled' },
]

function isEtaOverdue(trip: Trip, today = todayIso()) {
  return (
    (trip.status === 'in_transit' || trip.status === 'planned') &&
    trip.etaDate < today
  )
}

function margin(trip: Trip) {
  return trip.freightInr - trip.dieselInr - trip.tollInr
}

function marginPct(trip: Trip) {
  if (trip.freightInr <= 0) return null
  return Math.round((margin(trip) / trip.freightInr) * 100)
}

function dieselPerKm(trip: Trip) {
  if (trip.distanceKm <= 0) return null
  return Math.round(trip.dieselInr / trip.distanceKm)
}

/** Cash still to collect after driver advance (common Indian trip settlement). */
function balanceDue(trip: Trip) {
  return trip.freightInr - trip.advanceInr
}

export default function Trips() {
  const [statusFilter, setStatusFilter] = useState<'all' | TripStatus>('all')
  const [query, setQuery] = useState('')
  const [overdueOnly, setOverdueOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trips.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (overdueOnly && !isEtaOverdue(t)) return false
      if (!q) return true
      const truck = truckById(t.truckId)
      const driver = driverById(t.driverId)
      return (
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.cargo.toLowerCase().includes(q) ||
        (truck?.plate.toLowerCase().includes(q) ?? false) ||
        (driver?.name.toLowerCase().includes(q) ?? false)
      )
    })
  }, [statusFilter, query, overdueOnly])

  const overdueCount = useMemo(
    () => trips.filter((t) => isEtaOverdue(t)).length,
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Trips</h1>
          <p className="text-sm text-slate-500 mt-1">
            Lanes, freight, diesel ₹ & FASTag — trip P&L at a glance
            {overdueCount > 0 ? (
              <span className="ml-1 text-red-600 font-medium">
                · {overdueCount} overdue ETA{overdueCount === 1 ? '' : 's'}
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-amber-500 px-3.5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
        >
          Plan trip
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="trip-search" className="sr-only">
            Search trips by lane, cargo, plate, or driver
          </label>
          <input
            id="trip-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lane, cargo, plate…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter by trip status"
          >
            {STATUS_FILTERS.map((f) => {
              const active = statusFilter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
          {overdueCount > 0 ? (
            <button
              type="button"
              aria-pressed={overdueOnly}
              onClick={() => setOverdueOnly((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                overdueOnly
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
              }`}
            >
              Overdue ETA ({overdueCount})
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
          No trips match this search, status, or overdue ETA filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((trip) => {
            const truck = truckById(trip.truckId)
            const driver = driverById(trip.driverId)
            const m = margin(trip)
            const dpk = dieselPerKm(trip)
            const mp = marginPct(trip)
            const due = balanceDue(trip)
            const overdue = isEtaOverdue(trip)
            return (
              <div
                key={trip.id}
                className={`rounded-xl border bg-white p-5 shadow-sm ${
                  overdue ? 'border-red-200' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display text-lg font-semibold text-slate-900">
                        {trip.origin} → {trip.destination}
                      </h2>
                      <StatusBadge status={trip.status} />
                      {overdue ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          ETA overdue
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {trip.cargo} · {trip.distanceKm} km · {truck?.plate} · {driver?.name}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        overdue ? 'text-red-700 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Dep {trip.departureDate} · ETA {trip.etaDate}
                      {overdue ? (
                        <span className="sr-only"> (ETA overdue)</span>
                      ) : null}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Freight</p>
                    <p className="font-display text-xl font-bold text-slate-900">
                      {formatInr(trip.freightInr)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Diesel</p>
                    <p className="font-medium">{formatInr(trip.dieselInr)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Toll / FASTag</p>
                    <p className="font-medium">{formatInr(trip.tollInr)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Advance</p>
                    <p className="font-medium">{formatInr(trip.advanceInr)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Balance due</p>
                    <p
                      className={`font-semibold ${
                        due > 0 ? 'text-amber-800' : due < 0 ? 'text-red-600' : 'text-slate-700'
                      }`}
                    >
                      {formatInr(due)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Diesel ₹/km</p>
                    <p className="font-medium">{dpk != null ? formatInr(dpk) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Est. margin</p>
                    <p className={`font-semibold ${m >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {formatInr(m)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Margin %</p>
                    <p
                      className={`font-semibold ${
                        (mp ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {mp != null ? `${mp}%` : '—'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {trips.length} trips
      </p>
    </div>
  )
}
