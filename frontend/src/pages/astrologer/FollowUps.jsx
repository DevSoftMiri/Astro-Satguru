import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { consultations } from '../../assets/sampleData'

function FollowUps() {
  const rows = consultations.filter((item) => item.followUp)
  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'question', label: 'Topic' },
    { key: 'followUp', label: 'Follow-up Date' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
  ]
  return (
    <>
      <PageHeader title="Follow-ups" description="Reminder-ready queue for WhatsApp, SMS, and email notifications." />
      <DataTable columns={columns} rows={rows} />
    </>
  )
}

export default FollowUps
