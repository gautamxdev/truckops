import { useMemo, useState } from 'react'
import { Download, Fuel, Receipt, Search, Wrench, Wallet } from 'lucide-react'
import StatCard from '../components/StatCard'
import { expenses, financeSummary, formatInr, tripById, trips, truckById } from '../data/mock'
import type { Expense } from '../types'
import { formatDateIn, todayIso } from '../utils/dates'
import { downloadCsv, toCsv } from '../utils/csv'
import { plateMatches } from '../utils/plates'

type ExpenseCategory = Expense['category']

const categoryIcon = {
  diesel: Fuel,
  toll: Receipt,
  maintenance: Wrench,
  salary: Wallet,
  other: Receipt,
}

const categoryLabel = {
  diesel: 'Diesel',
  toll: 'Toll / FASTag',
  maintenance: 'Maintenance',
  salary: 'Salary / advance',
  other: 'Other',
}

const CATEGORY_FILTERS: { id: 'all' | ExpenseCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'toll', label: 'Toll' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'salary', label: 'Salary' },
  { id: 'other', label: 'Other' },
]

type ExpenseScope = 'all' | 'trip' | 'fleet'

const SCOPE_FILTERS: { id: ExpenseScope; label: string }[] = [
  { id: 'all', label: 'All scopes' },
  { id: 'trip', label: 'Trip-linked' },
  { id: 'fleet', label: 'Fleet / ops' },
]

type ExpenseSort = 'newest' | 'amount'

const SORT_OPTIONS: { id: ExpenseSort; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'amount', label: 'Highest amount' },
]

/** Flag individual line items that need a second look before approval. */
const LARGE_EXPENSE_INR = 15000

function isLargeExpense(e: Expense) {
  return e.amountInr >= LARGE_EXPENSE_INR
}

const COST_MIX_ROWS = [
  { label: 'Diesel', value: financeSummary.dieselInr, color: 'bg-amber-500' },
  { label: 'Toll', value: financeSummary.tollInr, color: 'bg-sky-500' },
  { label: 'Other', value: financeSummary.otherExpenseInr, color: 'bg-slate-400' },
]

const COST_MIX_TOTAL = COST_MIX_ROWS.reduce((s, row) => s + row.value, 0)

export default function Finances() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | ExpenseCategory>('all')
  const [scopeFilter, setScopeFilter] = useState<ExpenseScope>('all')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<ExpenseSort>('newest')
  const [largeOnly, setLargeOnly] = useState(false)

  const settledFreight = trips
    .filter((t) => t.status === 'settled' || t.status === 'delivered')
    .reduce((s, t) => s + t.freightInr, 0)

  const filteredExpenses = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = expenses.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      if (scopeFilter === 'trip' && !e.tripId) return false
      if (scopeFilter === 'fleet' && e.tripId) return false
      if (largeOnly && !isLargeExpense(e)) return false
      if (!q) return true
      const trip = e.tripId ? tripById(e.tripId) : undefined
      const lane = trip ? `${trip.origin} ${trip.destination}`.toLowerCase() : ''
      const plate = trip ? truckById(trip.truckId)?.plate : undefined
      return (
        e.description.toLowerCase().includes(q) ||
        categoryLabel[e.category].toLowerCase().includes(q) ||
        lane.includes(q) ||
        plateMatches(plate, q)
      )
    })
    // Ties fall back to newest first, then the order they were logged in.
    return matches.sort((a, b) => {
      if (sortBy === 'amount' && a.amountInr !== b.amountInr) return b.amountInr - a.amountInr
      return b.date.localeCompare(a.date)
    })
  }, [categoryFilter, scopeFilter, query, sortBy, largeOnly])

  const filteredTotal = useMemo(
    () => filteredExpenses.reduce((s, e) => s + e.amountInr, 0),
    [filteredExpenses],
  )

  const clearFilters = () => {
    setQuery('')
    setCategoryFilter('all')
    setScopeFilter('all')
    setLargeOnly(false)
  }

  const exportCsv = () => {
    const header = ['Date', 'Description', 'Category', 'Lane', 'Truck', 'Amount (INR)']
    const rows = filteredExpenses.map((e) => {
      const trip = e.tripId ? tripById(e.tripId) : undefined
      const plate = trip ? truckById(trip.truckId)?.plate ?? '' : ''
      return [
        e.date,
        e.description,
        categoryLabel[e.category],
        trip ? `${trip.origin} - ${trip.destination}` : 'Fleet / ops',
        plate,
        e.amountInr,
      ]
    })
    downloadCsv(`truckops-expenses-${todayIso()}.csv`, toCsv([header, ...rows]))
  }

  const largeCount = useMemo(
    () => expenses.filter((e) => isLargeExpense(e)).length,
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Finances</h1>
        <p className="text-sm text-slate-500 mt-1">
          {financeSummary.monthLabel} — revenue vs diesel, toll, and ops spend
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue"
          value={formatInr(financeSummary.revenueInr)}
          hint={`Settled/delivered freight ${formatInr(settledFreight)}`}
          icon={Wallet}
        />
        <StatCard
          label="Diesel"
          value={formatInr(financeSummary.dieselInr)}
          hint="Largest variable cost"
          icon={Fuel}
        />
        <StatCard
          label="Toll / FASTag"
          value={formatInr(financeSummary.tollInr)}
          icon={Receipt}
        />
        <StatCard
          label="Net"
          value={formatInr(financeSummary.netInr)}
          hint="After diesel, toll & other"
          icon={Wallet}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-display font-semibold text-slate-900 mb-4">Cost mix</h2>
          {COST_MIX_ROWS.map((row) => {
            const pct = COST_MIX_TOTAL ? Math.round((row.value / COST_MIX_TOTAL) * 100) : 0
            return (
              <div key={row.label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-medium">
                    {formatInr(row.value)} · {pct}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full bg-slate-100 overflow-hidden"
                  role="meter"
                  aria-label={`${row.label} share of costs`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                  aria-valuetext={`${pct}% · ${formatInr(row.value)}`}
                >
                  <div className={`h-full ${row.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display font-semibold text-slate-900">Recent expenses</h2>
              <div className="flex items-center gap-3">
                <p className="text-xs text-slate-500">
                  {filteredExpenses.length} item{filteredExpenses.length === 1 ? '' : 's'} ·{' '}
                  {formatInr(filteredTotal)}
                </p>
                <button
                  type="button"
                  onClick={exportCsv}
                  disabled={filteredExpenses.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  Export CSV
                  <span className="sr-only"> of the {filteredExpenses.length} expenses shown</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <label htmlFor="expense-search" className="sr-only">
                  Search expenses by description, category, trip lane, or truck plate
                </label>
                <input
                  id="expense-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search description, category, lane, plate…"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>
              <label htmlFor="expense-sort" className="sr-only">
                Sort expenses
              </label>
              <select
                id="expense-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ExpenseSort)}
                className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter expenses by category"
            >
              {CATEGORY_FILTERS.map((f) => {
                const active = categoryFilter === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategoryFilter(f.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter expenses by trip vs fleet scope"
            >
              {SCOPE_FILTERS.map((f) => {
                const active = scopeFilter === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setScopeFilter(f.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                      active
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
              {largeCount > 0 ? (
                <button
                  type="button"
                  aria-pressed={largeOnly}
                  onClick={() => setLargeOnly((v) => !v)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                    largeOnly
                      ? 'bg-violet-700 text-white'
                      : 'bg-violet-50 text-violet-900 border border-violet-200 hover:bg-violet-100'
                  }`}
                >
                  Large ≥{formatInr(LARGE_EXPENSE_INR)} ({largeCount})
                </button>
              ) : null}
            </div>
          </div>
          {filteredExpenses.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-slate-500">
                No expenses match this search, category, scope, or large-amount filter.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredExpenses.map((e) => {
                const Icon = categoryIcon[e.category]
                const trip = e.tripId ? tripById(e.tripId) : undefined
                const plate = trip ? truckById(trip.truckId)?.plate : undefined
                const large = isLargeExpense(e)
                return (
                  <li key={e.id} className="px-5 py-3.5 flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {e.description}
                          {large ? (
                            <span className="ml-1.5 inline-flex align-middle rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-900">
                              Large
                              <span className="sr-only">
                                {' '}
                                (₹{LARGE_EXPENSE_INR.toLocaleString('en-IN')}+ line item)
                              </span>
                            </span>
                          ) : null}
                        </p>
                        <p className="text-xs text-slate-500">
                          {categoryLabel[e.category]} · {formatDateIn(e.date)}
                          {trip ? (
                            <span className="text-slate-600">
                              {' '}
                              · {trip.origin} → {trip.destination}
                              {plate ? ` · ${plate}` : ''}
                            </span>
                          ) : (
                            <span className="text-slate-400"> · fleet / ops</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">
                      {formatInr(e.amountInr)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
