import { useMemo, useState } from 'react'
import { Search, Wrench } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { trucks } from '../data/mock'
import type { TruckStatus } from '../types'

import { dueInLabel, formatDateIn, isDueSoon, isExpired } from '../utils/dates'
import { plateMatches } from '../utils/plates'

const SERVICE_INTERVAL_KM = 10000

function kmSinceService(odometerKm: number, lastServiceKm: number) {
  return Math.max(0, odometerKm - lastServiceKm)
}

function needsService(odometerKm: number, lastServiceKm: number) {
  return kmSinceService(odometerKm, lastServiceKm) >= SERVICE_INTERVAL_KM
}

function needsAttention(t: {
  fitnessExpiry: string
  insuranceExpiry: string
  odometerKm: number
  lastServiceKm: number
}) {
  return (
    isExpired(t.fitnessExpiry) ||
    isExpired(t.insuranceExpiry) ||
    needsService(t.odometerKm, t.lastServiceKm)
  )
}

const STATUS_FILTERS: { id: 'all' | TruckStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'on_trip', label: 'On trip' },
  { id: 'available', label: 'Available' },
  { id: 'maintenance', label: 'Workshop' },
  { id: 'idle', label: 'Idle' },
]

function DocDate({ value, label }: { value: string; label: string }) {
  const expired = isExpired(value)
  const soon = isDueSoon(value)
  const tone = expired
    ? 'text-red-700 font-medium'
    : soon
      ? 'text-orange-700 font-medium'
      : 'text-slate-600'
  const hint = expired ? 'expired' : soon ? `due ${dueInLabel(value)}` : null

  return (
    <span className={`whitespace-nowrap ${tone}`}>
      {formatDateIn(value)}
      {hint ? (
        <span className="sr-only">
          {' '}
          ({label} {hint})
        </span>
      ) : null}
      {hint ? (
        <span
          className={`ml-1.5 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            expired ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
          }`}
          aria-hidden="true"
        >
          {hint}
        </span>
      ) : null}
    </span>
  )
}

export default function Trucks() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TruckStatus>('all')
  const [alertsOnly, setAlertsOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return trucks.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false
      if (alertsOnly && !needsAttention(t)) return false
      if (!q) return true
      return (
        plateMatches(t.plate, q) ||
        t.model.toLowerCase().includes(q)
      )
    })
  }, [query, statusFilter, alertsOnly])

  const serviceDueCount = useMemo(
    () => trucks.filter((t) => needsService(t.odometerKm, t.lastServiceKm)).length,
    [],
  )

  const alertCount = useMemo(() => trucks.filter((t) => needsAttention(t)).length, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Trucks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registration, capacity, fitness & insurance across the fleet
            {serviceDueCount > 0 ? (
              <span className="ml-1 text-red-600 font-medium">
                · {serviceDueCount} due for service
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Add truck
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="truck-search" className="sr-only">
            Search trucks by plate or model
          </label>
          <input
            id="truck-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plate or model"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filter by truck status"
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
          {alertCount > 0 ? (
            <button
              type="button"
              aria-pressed={alertsOnly}
              onClick={() => setAlertsOnly((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                alertsOnly
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              Needs attention ({alertCount})
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Plate</th>
                <th scope="col" className="px-5 py-3 font-medium">Model</th>
                <th scope="col" className="px-5 py-3 font-medium">Capacity</th>
                <th scope="col" className="px-5 py-3 font-medium">Status</th>
                <th scope="col" className="px-5 py-3 font-medium">Fitness</th>
                <th scope="col" className="px-5 py-3 font-medium">Insurance</th>
                <th scope="col" className="px-5 py-3 font-medium">Odometer</th>
                <th scope="col" className="px-5 py-3 font-medium" title={`Service every ${SERVICE_INTERVAL_KM.toLocaleString('en-IN')} km`}>
                  Since service
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    No trucks match this search, status, or attention filter.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const since = kmSinceService(t.odometerKm, t.lastServiceKm)
                  const due = needsService(t.odometerKm, t.lastServiceKm)
                  const serviceTone = due
                    ? 'text-red-700 font-medium'
                    : since >= SERVICE_INTERVAL_KM * 0.8
                      ? 'text-orange-700 font-medium'
                      : 'text-slate-600'
                  return (
                    <tr
                      key={t.id}
                      className={
                        needsAttention(t)
                          ? 'bg-orange-50/40 hover:bg-orange-50/70'
                          : 'hover:bg-slate-50/80'
                      }
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                        {t.plate}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">{t.model}</td>
                      <td className="px-5 py-3.5 text-slate-600">{t.capacityTons} T</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <DocDate value={t.fitnessExpiry} label="fitness" />
                      </td>
                      <td className="px-5 py-3.5">
                        <DocDate value={t.insuranceExpiry} label="insurance" />
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                        {t.odometerKm.toLocaleString('en-IN')} km
                        {t.status === 'maintenance' ? (
                          <span className="ml-2 inline-flex items-center gap-1 text-orange-600 text-xs">
                            <Wrench className="h-3 w-3" aria-hidden="true" /> workshop
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={serviceTone}>
                          {since.toLocaleString('en-IN')} km
                          {due ? (
                            <span className="sr-only">
                              {' '}
                              (service overdue, interval{' '}
                              {SERVICE_INTERVAL_KM.toLocaleString('en-IN')} km)
                            </span>
                          ) : null}
                          {due ? (
                            <span
                              className="ml-1.5 inline-flex rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800"
                              aria-hidden="true"
                            >
                              due
                            </span>
                          ) : null}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-100 px-5 py-2.5 text-xs text-slate-500">
          Showing {filtered.length} of {trucks.length} trucks
        </div>
      </div>
    </div>
  )
}
