import { CalendarCheck, CreditCard, IndianRupee, Users } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatCard from '../../components/StatCard.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { analyticsSeries, consultations } from '../../assets/sampleData'

function AdminDashboard() {
  const columns = [
    { key: 'customer', label: 'Customer' },
    { key: 'astrologer', label: 'Astrologer' },
    { key: 'question', label: 'Question' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
    { key: 'payment', label: 'Payment', render: (row) => <StatusBadge value={row.payment} /> },
    { key: 'amount', label: 'Amount' },
  ]

  return (
    <>
      <PageHeader title="Admin Dashboard" description="Live CRM overview for customers, astrologers, consultations, payments, and revenue." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Customers" value="4,820" change="+18% this month" icon={Users} tone="bg-indigo-50" />
        <StatCard title="Today Customers" value="42" change="+7 since morning" icon={CalendarCheck} tone="bg-amber-50" />
        <StatCard title="Total Consultations" value="9,614" change="216 this month" icon={CalendarCheck} tone="bg-fuchsia-50" />
        <StatCard title="Revenue Analytics" value="₹19.8L" change="+12.4% this month" icon={IndianRupee} tone="bg-emerald-50" />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Monthly Analytics</h2>
              <p className="text-sm text-slate-500">Consultations and revenue trend</p>
            </div>
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="consultations" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="consultations" stroke="#4f46e5" fill="url(#consultations)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent Activity</h2>
          <div className="mt-5 space-y-4">
            {['Astrologer password reset completed', 'New payment marked as PAID', 'Follow-up reminder queued', 'Customer duplicate prevented by phone'].map((item) => (
              <div key={item} className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <DataTable columns={columns} rows={consultations} />
      </div>
    </>
  )
}

export default AdminDashboard
