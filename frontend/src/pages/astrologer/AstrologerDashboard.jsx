import { CalendarClock, CheckCircle2, Search, Users } from 'lucide-react'
import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { consultations } from '../../assets/sampleData'

function AstrologerDashboard() {
  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'question', label: 'Question' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'payment', label: 'Payment', render: (row) => <StatusBadge value={row.payment} /> },
    { key: 'followUp', label: 'Follow-up' },
  ]
  return (
    <>
      <PageHeader title="Astrologer Dashboard" description="Today's customers, pending consultations, completed cases, and follow-ups." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Customers" value="18" icon={Users} tone="bg-indigo-50" />
        <StatCard title="Pending Consultations" value="7" icon={CalendarClock} tone="bg-amber-50" />
        <StatCard title="Completed" value="32" icon={CheckCircle2} tone="bg-emerald-50" />
        <StatCard title="Follow-ups" value="5" icon={Search} tone="bg-fuchsia-50" />
      </div>
      <div className="mt-5">
        <DataTable columns={columns} rows={consultations} />
      </div>
    </>
  )
}

export default AstrologerDashboard
