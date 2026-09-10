import { Link } from 'react-router-dom'
import {
  Truck,
  Users,
  MapPinned,
  Wallet,
  Fuel,
  ShieldCheck,
  ArrowRight,
  IndianRupee,
  Route,
} from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Fleet that stays roadworthy',
    body: 'Track RC, fitness, insurance & PUC dates across MH, KA, GJ plates — before a challan stops the trip.',
  },
  {
    icon: Users,
    title: 'Drivers assigned with clarity',
    body: 'Licence validity, phone, home base, and which truck they are running today. No more WhatsApp archaeology.',
  },
  {
    icon: MapPinned,
    title: 'Trips from loading to pod',
    body: 'Pune→Nashik, Bengaluru→Chennai, Mundra→Delhi — freight, diesel, FASTag, and advance in one place.',
  },
  {
    icon: Wallet,
    title: 'Diesel, toll & money that adds up',
    body: 'See trip margin after diesel ₹, toll, and broker cut. Know which lanes actually pay.',
  },
]

const stats = [
  { label: 'Built for Indian fleets', value: 'MH · KA · GJ · TN' },
  { label: 'Track what burns cash', value: 'Diesel + FASTag' },
  { label: 'From 5 trucks to 50+', value: 'Scale ready' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Truck className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">TruckOps</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#how" className="hover:text-white transition">
              How it works
            </a>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 font-semibold text-slate-950 hover:bg-amber-400 transition"
            >
              Open app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
          <Link
            to="/app"
            className="sm:hidden inline-flex items-center rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950"
          >
            Open app
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 mb-6">
            <Fuel className="h-3.5 w-3.5" />
            Built for transporters, fleet owners & brokers in India
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">
            Run your trucks like a business —{' '}
            <span className="text-amber-400">not a WhatsApp folder</span>
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
            TruckOps helps Indian trucking businesses organise fleet, drivers, trips, diesel,
            tolls, and trip money in one clean ops desk. Less chaos. Clearer margins.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/25"
            >
              Try the demo app
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-5 py-3 font-medium text-slate-200 hover:border-slate-500 transition"
            >
              See what it covers
            </a>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4"
              >
                <div className="font-display text-xl font-bold text-amber-400">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-slate-800/80 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-xl mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Everything that keeps a truck moving
            </h2>
            <p className="mt-3 text-slate-400">
              From registration papers to FASTag spends — the ops you already do, without the
              spreadsheet mess.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 hover:border-amber-500/30 transition"
              >
                <div className="h-10 w-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-slate-800/80">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-10">
            A day on the road, in three screens
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Route,
                title: 'Plan the trip',
                body: 'Pick truck + driver, set origin/destination, load type, and broker freight.',
              },
              {
                step: '02',
                icon: Fuel,
                title: 'Log the burn',
                body: 'Diesel fills, FASTag tolls, parking, and advances — attached to the trip.',
              },
              {
                step: '03',
                icon: IndianRupee,
                title: 'Close the books',
                body: 'POD in, balance due, trip P&L visible. Know which lanes are worth repeating.',
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-slate-800 p-6">
                <div className="text-amber-500/40 font-display text-4xl font-bold absolute top-4 right-5">
                  {item.step}
                </div>
                <item.icon className="h-6 w-6 text-amber-400 mb-4" />
                <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800/80 bg-gradient-to-b from-amber-500/10 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <ShieldCheck className="h-10 w-10 text-amber-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Ready to tidy up the fleet desk?
          </h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            This is a working UI starter with realistic Indian mock data — open the app and click
            around.
          </p>
          <Link
            to="/app"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-semibold text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/25"
          >
            Enter TruckOps
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-amber-500" />
            <span className="font-medium text-slate-400">TruckOps</span>
          </div>
          <p>Made for Indian trucking · Demo starter</p>
        </div>
      </footer>
    </div>
  )
}
