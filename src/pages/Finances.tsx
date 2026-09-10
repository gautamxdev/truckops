import { Fuel, Receipt, Wrench, Wallet } from 'lucide-react'
import StatCard from '../components/StatCard'
import { expenses, financeSummary, formatInr, trips } from '../data/mock'

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

export default function Finances() {
  const settledFreight = trips
    .filter((t) => t.status === 'settled' || t.status === 'delivered')
    .reduce((s, t) => s + t.freightInr, 0)

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
          {[
            { label: 'Diesel', value: financeSummary.dieselInr, color: 'bg-amber-500' },
            { label: 'Toll', value: financeSummary.tollInr, color: 'bg-sky-500' },
            { label: 'Other', value: financeSummary.otherExpenseInr, color: 'bg-slate-400' },
          ].map((row) => {
            const total =
              financeSummary.dieselInr + financeSummary.tollInr + financeSummary.otherExpenseInr
            const pct = total ? Math.round((row.value / total) * 100) : 0
            return (
              <div key={row.label} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{row.label}</span>
                  <span className="font-medium">
                    {formatInr(row.value)} · {pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${row.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-display font-semibold text-slate-900">Recent expenses</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {expenses.map((e) => {
              const Icon = categoryIcon[e.category]
              return (
                <li key={e.id} className="px-5 py-3.5 flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{e.description}</p>
                      <p className="text-xs text-slate-500">
                        {categoryLabel[e.category]} · {e.date}
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
        </div>
      </div>
    </div>
  )
}
