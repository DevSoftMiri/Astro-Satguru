function StatCard({ title, value, change, icon: Icon, tone = 'bg-white' }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        {Icon ? (
          <span className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}>
            <Icon className="h-5 w-5 text-slate-800" />
          </span>
        ) : null}
      </div>
      {change ? <p className="mt-3 text-xs font-medium text-emerald-600">{change}</p> : null}
    </div>
  )
}

export default StatCard
