import { useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import { QUESTION_PLANS } from '../../utils/constants'

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  gender: 'Female',
  dateOfBirth: '',
  timeOfBirth: '',
  placeOfBirth: '',
  address: '',
  questionPlan: 'ONE_QUESTION',
  planExpiryDate: '',
  notes: '',
  tags: '',
}

function AddCustomer() {
  const [form, setForm] = useState(initialForm)
  const plan = QUESTION_PLANS[form.questionPlan]

  return (
    <>
      <PageHeader title="Add Customer" description="Phone number uniqueness prevents duplicates and auto-fetches existing customer history." />
      <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['fullName', 'Full Name'],
            ['phone', 'Phone Number'],
            ['email', 'Email'],
            ['dateOfBirth', 'Date of Birth', 'date'],
            ['timeOfBirth', 'Time of Birth', 'time'],
            ['placeOfBirth', 'Place of Birth'],
            ['address', 'Address'],
            ['planExpiryDate', 'Plan Expiry Date', 'date'],
            ['tags', 'Tags'],
          ].map(([name, label, type = 'text']) => (
            <label key={name} className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>
              <input type={type} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" />
            </label>
          ))}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Gender</span>
            <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3">
              <option>Female</option><option>Male</option><option>Other</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Question Plan</span>
            <select value={form.questionPlan} onChange={(event) => setForm({ ...form, questionPlan: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3">
              {Object.entries(QUESTION_PLANS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
            <p className="mt-1 text-xs font-medium text-slate-500">Questions allowed: {plan.allowed === -1 ? 'Unlimited' : plan.allowed}</p>
          </label>
          <label className="md:col-span-2 xl:col-span-3">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Notes</span>
            <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="min-h-28 w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" />
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white" type="button">Save Customer</button>
        </div>
      </form>
    </>
  )
}

export default AddCustomer
