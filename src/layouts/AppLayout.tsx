import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPinned,
  Wallet,
  ChevronLeft,
} from 'lucide-react'

const nav = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/trucks', end: false, label: 'Trucks', icon: Truck },
  { to: '/app/drivers', end: false, label: 'Drivers', icon: Users },
  { to: '/app/trips', end: false, label: 'Trips', icon: MapPinned },
  { to: '/app/finances', end: false, label: 'Finances', icon: Wallet },
]

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-60 shrink-0 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
        <div className="h-16 px-4 flex items-center gap-2.5 border-b border-slate-800">
          <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <Truck className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-sm leading-none">TruckOps</div>
            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
              Fleet desk
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to marketing site
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs text-slate-500">Demo fleet · Western & South India</p>
            <p className="text-sm font-semibold text-slate-800">Alva Logistics Pvt Ltd</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500">Sep 2026</span>
            <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
              GA
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
