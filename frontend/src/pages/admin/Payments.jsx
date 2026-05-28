import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { consultations } from '../../assets/sampleData'

function Payments() {
  const rows = consultations.map((item) => ({ ...item, method: item.payment === 'PENDING' ? 'UPI' : 'Cash', transactionId: `TXN-${item.id.toUpperCase()}-2026` }))
  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Method' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'payment', label: 'Status', render: (row) => <StatusBadge value={row.payment} /> },
  ]
  return (
    <>
      <PageHeader title="Payments" description="Manage paid, pending, failed, refunded payments and dues." />
      <DataTable columns={columns} rows={rows} />
    </>
  )
}

export default Payments
