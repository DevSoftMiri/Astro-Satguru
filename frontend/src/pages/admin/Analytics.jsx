import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import PageHeader from '../../components/PageHeader.jsx'
import { analyticsSeries } from '../../assets/sampleData'

function Analytics() {
  return (
    <>
      <PageHeader title="Analytics" description="Daily consultation analytics, monthly trends, and revenue views." />
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export default Analytics
