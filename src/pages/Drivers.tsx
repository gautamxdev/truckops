import StatusBadge from '../components/StatusBadge'
import { drivers, truckById } from '../data/mock'

export default function Drivers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Drivers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Licence, home base, assignment — keep the roster current
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add driver
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((d) => {
          const truck = d.assignedTruckId ? truckById(d.assignedTruckId) : null
          return (
            <div
              key={d.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display font-semibold text-slate-900">{d.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{d.homeBase} · {d.experienceYears} yrs</p>
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
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Valid till</dt>
                  <dd className="text-slate-700">{d.licenceExpiry}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Truck</dt>
                  <dd className="font-medium text-slate-800">{truck?.plate ?? 'Unassigned'}</dd>
                </div>
              </dl>
            </div>
          )
        })}
      </div>
    </div>
  )
}
