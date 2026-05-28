import StatusBadge from './StatusBadge.jsx'

function CustomerTimeline({ items }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Customer History Timeline</h2>
      <div className="mt-5 space-y-5">
        {items.map((item) => (
          <div key={item.id} className="relative border-l border-slate-200 pl-5">
            <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-cosmic ring-4 ring-indigo-50" />
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <StatusBadge value={item.status} />
            </div>
            <p className="mt-1 text-sm text-slate-500">{item.date} by {item.astrologer}</p>
            <p className="mt-2 text-sm text-slate-700">{item.notes}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerTimeline
