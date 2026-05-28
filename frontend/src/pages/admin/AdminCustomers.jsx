import { Download } from 'lucide-react'
import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SearchFilters from '../../components/SearchFilters.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { customers } from '../../assets/sampleData'
import { useState } from 'react'

function AdminCustomers() {
  const [search, setSearch] = useState('')
  const columns = [
    { key: 'name', label: 'Customer' },
    { key: 'phone', label: 'Phone' },
    { key: 'dob', label: 'DOB' },
    { key: 'plan', label: 'Question Plan' },
    { key: 'remaining', label: 'Remaining' },
    { key: 'astrologer', label: 'Created By' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]

  return (
    <>
      <PageHeader title="Customers" description="Search, filter, deduplicate by phone, and view complete history." actions={<button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"><Download className="h-4 w-4" /> Export</button>} />
      <SearchFilters search={search} onSearch={setSearch}>
        <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>Monthly</option><option>Daily</option><option>Weekly</option><option>Custom range</option></select>
        <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>All statuses</option><option>Active</option><option>Inactive</option></select>
      </SearchFilters>
      <DataTable columns={columns} rows={customers.filter((item) => `${item.name} ${item.phone}`.toLowerCase().includes(search.toLowerCase()))} />
    </>
  )
}

export default AdminCustomers
