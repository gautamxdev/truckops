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

export default function Dashboard() {
  const onTrip = trucks.filter((t) => t.status === 'on_trip').length
  const available = trucks.filter((t) => t.status === 'available').length
  const activeTrips = trips.filter((t) => t.status === 'in_transit' || t.status === 'planned')
  const fitnessSoon = trucks.filter((t) => t.fitnessExpiry < '2026-10-01')

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
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-display font-semibold text-slate-900">Live trips</h2>
            <span className="text-xs text-slate-500">{activeTrips.length} open</span>
          </div>
          <div className="divide-y divide-slate-100">
            {activeTrips.map((trip) => {
              const truck = truckById(trip.truckId)
              const driver = driverById(trip.driverId)
              return (
                <div key={trip.id} className="px-5 py-4 flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {trip.origin} → {trip.destination}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {truck?.plate} · {driver?.name} · {trip.cargo}
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

          {fitnessSoon.length > 0 ? (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-center gap-2 text-orange-800 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <h2 className="font-display font-semibold text-sm">Fitness / docs due soon</h2>
              </div>
              <ul className="space-y-1.5 text-sm text-orange-900/80">
                {fitnessSoon.map((t) => (
                  <li key={t.id}>
                    {t.plate} — fitness {t.fitnessExpiry}
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
