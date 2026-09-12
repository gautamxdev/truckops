import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Truck,
  Users,
  MapPinned,
  Wallet,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react'

const nav = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/trucks', end: false, label: 'Trucks', icon: Truck },
  { to: '/app/drivers', end: false, label: 'Drivers', icon: Users },
  { to: '/app/trips', end: false, label: 'Trips', icon: MapPinned },
  { to: '/app/finances', end: false, label: 'Finances', icon: Wallet },
]

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  const sidebar = (
    <>
      <div className="h-16 px-4 flex items-center justify-between gap-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Truck className="h-4 w-4 text-slate-950" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-sm leading-none">TruckOps</div>
            <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
              Fleet desk
            </div>
          </div>
        </div>
        <button
          type="button"
          className="lg:hidden rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5" aria-label="App">
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
    </>
  )

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-slate-900 text-slate-100 flex-col border-r border-slate-800">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60"
            aria-label="Close navigation overlay"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(16.5rem,85vw)] bg-slate-900 text-slate-100 flex flex-col shadow-xl border-r border-slate-800">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
              aria-label="Open navigation"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 truncate">Demo fleet · Western & South India</p>
              <p className="text-sm font-semibold text-slate-800 truncate">Alva Logistics Pvt Ltd</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-xs text-slate-500">Sep 2026</span>
            <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
              GA
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
