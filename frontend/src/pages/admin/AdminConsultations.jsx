import { useState } from 'react'
import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import SearchFilters from '../../components/SearchFilters.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { consultations } from '../../assets/sampleData'

function AdminConsultations() {
  const [search, setSearch] = useState('')
  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'astrologer', label: 'Astrologer' },
    { key: 'question', label: 'Questions Asked' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'payment', label: 'Payment', render: (row) => <StatusBadge value={row.payment} /> },
    { key: 'amount', label: 'Amount' },
    { key: 'followUp', label: 'Follow-up' },
  ]
  return (
    <>
      <PageHeader title="Consultations" description="Track NEW, IN_PROGRESS, COMPLETED, FOLLOW_UP and CLOSED cases." />
      <SearchFilters search={search} onSearch={setSearch}>
        <select className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>All statuses</option><option>Pending</option><option>Completed</option></select>
      </SearchFilters>
      <DataTable columns={columns} rows={consultations.filter((item) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))} />
    </>
  )
}

export default AdminConsultations
