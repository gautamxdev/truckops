import StatusBadge from '../components/StatusBadge'
import { driverById, formatInr, trips, truckById } from '../data/mock'

function margin(trip: (typeof trips)[0]) {
  return trip.freightInr - trip.dieselInr - trip.tollInr
}

export default function Trips() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Trips</h1>
          <p className="text-sm text-slate-500 mt-1">
            Lanes, freight, diesel ₹ & FASTag — trip P&L at a glance
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-amber-500 px-3.5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400"
        >
          Plan trip
        </button>
      </div>

      <div className="space-y-3">
        {trips.map((trip) => {
          const truck = truckById(trip.truckId)
          const driver = driverById(trip.driverId)
          const m = margin(trip)
          return (
            <div
              key={trip.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display text-lg font-semibold text-slate-900">
                      {trip.origin} → {trip.destination}
                    </h2>
                    <StatusBadge status={trip.status} />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {trip.cargo} · {trip.distanceKm} km · {truck?.plate} · {driver?.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Dep {trip.departureDate} · ETA {trip.etaDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Freight</p>
                  <p className="font-display text-xl font-bold text-slate-900">
                    {formatInr(trip.freightInr)}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
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
                  <p className="text-xs text-slate-500">Est. margin</p>
                  <p className={`font-semibold ${m >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {formatInr(m)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
