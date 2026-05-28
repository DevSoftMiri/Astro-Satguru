import { Search } from 'lucide-react'

function SearchFilters({ search, onSearch, children }) {
  return (
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
      <label className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search by name, phone, DOB, astrologer or status"
          className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-cosmic focus:bg-white focus:ring-2 focus:ring-cosmic/10"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

export default SearchFilters
