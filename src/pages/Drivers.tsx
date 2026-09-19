import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { drivers, truckById } from '../data/mock'
import type { DriverStatus } from '../types'

const STATUS_FILTERS: { id: 'all' | DriverStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'on_trip', label: 'On trip' },
  { id: 'available', label: 'Available' },
  { id: 'off_duty', label: 'Off duty' },
]

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function isExpired(isoDate: string, today = todayIso()) {
  return isoDate < today
}

function isDueSoon(isoDate: string, today = todayIso(), withinDays = 45) {
  if (isoDate < today) return false
  const due = new Date(`${isoDate}T00:00:00`)
  const now = new Date(`${today}T00:00:00`)
  const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= withinDays
}

function LicenceDate({ value }: { value: string }) {
  const expired = isExpired(value)
  const soon = isDueSoon(value)
  const tone = expired
    ? 'text-red-700 font-medium'
    : soon
      ? 'text-orange-700 font-medium'
      : 'text-slate-700'
  const hint = expired ? 'expired' : soon ? 'due soon' : null

  return (
    <dd className={tone}>
      <span className="whitespace-nowrap">{value}</span>
      {hint ? (
        <span className="sr-only"> (licence {hint})</span>
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
    </dd>
  )
}

export default function Drivers() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | DriverStatus>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return drivers.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false
      if (!q) return true
      return (
        d.name.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.homeBase.toLowerCase().includes(q) ||
        d.licenceNo.toLowerCase().includes(q)
      )
    })
  }, [query, statusFilter])

  const expiredCount = useMemo(
    () => drivers.filter((d) => isExpired(d.licenceExpiry)).length,
    [],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Drivers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Licence, home base, assignment — keep the roster current
            {expiredCount > 0 ? (
              <span className="ml-1 text-red-600 font-medium">
                · {expiredCount} licence{expiredCount === 1 ? '' : 's'} expired
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          Add driver
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="driver-search" className="sr-only">
            Search drivers by name, phone, base, or licence
          </label>
          <input
            id="driver-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, base…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
          />
        </div>
        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Filter by driver status"
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
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
          No drivers match this search or status filter.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d) => {
            const truck = d.assignedTruckId ? truckById(d.assignedTruckId) : null
            const licenceBad = isExpired(d.licenceExpiry) || isDueSoon(d.licenceExpiry)
            return (
              <div
                key={d.id}
                className={`rounded-xl border bg-white p-5 shadow-sm space-y-3 ${
                  licenceBad ? 'border-orange-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display font-semibold text-slate-900">{d.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {d.homeBase} · {d.experienceYears} yrs
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Phone</dt>
                    <dd className="font-medium text-slate-800">{d.phone}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Licence</dt>
                    <dd className="font-mono text-xs text-slate-700">{d.licenceNo}</dd>
                  </div>
                  <div className="flex justify-between gap-2 items-center">
                    <dt className="text-slate-500">Valid till</dt>
                    <LicenceDate value={d.licenceExpiry} />
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-slate-500">Truck</dt>
                    <dd className="font-medium text-slate-800">
                      {truck?.plate ?? 'Unassigned'}
                    </dd>
                  </div>
                </dl>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {drivers.length} drivers
      </p>
    </div>
  )
}
