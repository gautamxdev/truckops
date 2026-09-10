const styles: Record<string, string> = {
  on_trip: 'bg-sky-100 text-sky-800',
  available: 'bg-emerald-100 text-emerald-800',
  maintenance: 'bg-orange-100 text-orange-800',
  idle: 'bg-slate-200 text-slate-700',
  off_duty: 'bg-slate-200 text-slate-700',
  planned: 'bg-violet-100 text-violet-800',
  in_transit: 'bg-sky-100 text-sky-800',
  delivered: 'bg-amber-100 text-amber-900',
  settled: 'bg-emerald-100 text-emerald-800',
}

const labels: Record<string, string> = {
  on_trip: 'On trip',
  available: 'Available',
  maintenance: 'Workshop',
  idle: 'Idle',
  off_duty: 'Off duty',
  planned: 'Planned',
  in_transit: 'In transit',
  delivered: 'Delivered',
  settled: 'Settled',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {labels[status] ?? status}
    </span>
  )
}
