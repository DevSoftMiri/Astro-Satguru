const toneMap = {
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  PAID: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  NEW: 'bg-blue-50 text-blue-700 ring-blue-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 ring-amber-200',
  FOLLOW_UP: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
  FAILED: 'bg-rose-50 text-rose-700 ring-rose-200',
  REFUNDED: 'bg-slate-100 text-slate-700 ring-slate-200',
  CLOSED: 'bg-slate-100 text-slate-700 ring-slate-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  INACTIVE: 'bg-slate-100 text-slate-700 ring-slate-200',
}

function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneMap[value] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
      {String(value).replaceAll('_', ' ')}
    </span>
  )
}

export default StatusBadge
