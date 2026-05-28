import { useState } from 'react'
import CustomerTimeline from '../../components/CustomerTimeline.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { customers, timeline } from '../../assets/sampleData'

function CustomerHistory() {
  const [phone, setPhone] = useState('+91 98765 43210')
  const customer = customers.find((item) => item.phone === phone) || customers[0]

  return (
    <>
      <PageHeader title="Customer History" description="Enter a phone number to auto-load customer data, previous astrologers, questions, remedies, and notes." />
      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block max-w-md">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</span>
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" />
        </label>
      </div>
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">{customer.name}</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Phone:</span> {customer.phone}</p>
            <p><span className="font-semibold text-slate-900">DOB:</span> {customer.dob}</p>
            <p><span className="font-semibold text-slate-900">Plan:</span> {customer.plan}</p>
            <p><span className="font-semibold text-slate-900">Remaining:</span> {customer.remaining}</p>
            <p><span className="font-semibold text-slate-900">Previous astrologer:</span> {customer.astrologer}</p>
          </div>
        </div>
        <CustomerTimeline items={timeline} />
      </div>
    </>
  )
}

export default CustomerHistory
