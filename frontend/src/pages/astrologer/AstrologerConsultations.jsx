import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { consultations } from '../../assets/sampleData'

function AstrologerConsultations() {
  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'question', label: 'Questions Asked' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'payment', label: 'Payment', render: (row) => <StatusBadge value={row.payment} /> },
    { key: 'actions', label: 'Actions', render: () => <button className="rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white">Add Notes</button> },
  ]
  return (
    <>
      <PageHeader title="Consultations" description="Add questions, remedies, internal notes, attachments, and voice note references." />
      <DataTable columns={columns} rows={consultations} />
    </>
  )
}

export default AstrologerConsultations
