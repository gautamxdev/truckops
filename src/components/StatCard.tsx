import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  to,
  linkLabel,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  /** When set, the whole card links here (e.g. a pre-filtered list). */
  to?: string
  /** Accessible name for the link; without it the card text is read. */
  linkLabel?: string
}) {
  const body = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-2 font-display text-2xl font-bold text-slate-900">{value}</p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
      <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
  )

  if (to) {
    return (
      <Link
        to={to}
        aria-label={linkLabel}
        className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:bg-amber-50/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
      >
        {body}
      </Link>
    )
  }

  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">{body}</div>
}
