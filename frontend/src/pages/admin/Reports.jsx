import PageHeader from '../../components/PageHeader.jsx'

function Reports() {
  return (
    <>
      <PageHeader title="Reports" description="Export customer, consultation, revenue, and astrologer performance reports." />
      <div className="grid gap-4 md:grid-cols-3">
        {['Customer report', 'Consultation report', 'Revenue report', 'Astrologer performance', 'Pending dues', 'Plan expiry'].map((item) => (
          <button key={item} className="rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm">
            <span className="text-sm font-semibold text-slate-950">{item}</span>
            <p className="mt-2 text-sm text-slate-500">Date range filters and export API ready.</p>
          </button>
        ))}
      </div>
    </>
  )
}

export default Reports
