import { Wrench } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { trucks } from '../data/mock'

export default function Trucks() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Trucks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registration, capacity, fitness & insurance across the fleet
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add truck
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Plate</th>
                <th className="px-5 py-3 font-medium">Model</th>
                <th className="px-5 py-3 font-medium">Capacity</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Fitness</th>
                <th className="px-5 py-3 font-medium">Insurance</th>
                <th className="px-5 py-3 font-medium">Odometer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trucks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                    {t.plate}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{t.model}</td>
                  <td className="px-5 py-3.5 text-slate-600">{t.capacityTons} T</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{t.fitnessExpiry}</td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                    {t.insuranceExpiry}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                    {t.odometerKm.toLocaleString('en-IN')} km
                    {t.status === 'maintenance' ? (
                      <span className="ml-2 inline-flex items-center gap-1 text-orange-600 text-xs">
                        <Wrench className="h-3 w-3" /> workshop
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
