import { BadgeCheck, Clock, FileText, MessageCircle, Phone } from 'lucide-react'

const formatDate = (value) => {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function CustomerProfileCard({ customer, onContinue, onRegenerate, onPrint, onShare }) {
  if (!customer) return null

  const reports = customer.generatedReports || []
  const chats = customer.aiAstrologerChats || []

  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">
            <BadgeCheck size={14} /> Existing Client Found
          </div>
          <h2 className="mt-3 text-xl font-semibold text-slate-950">{customer.fullName || customer.name || 'Saved Customer'}</h2>
          <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2"><Phone size={15} /> {customer.phone || customer.mobileNumber}</span>
            <span className="inline-flex items-center gap-2"><Clock size={15} /> Last visit: {formatDate(customer.updatedAt || customer.createdAt)}</span>
            <span className="inline-flex items-center gap-2"><FileText size={15} /> Reports: {reports.length}</span>
            <span className="inline-flex items-center gap-2"><MessageCircle size={15} /> AI chats: {chats.length}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onContinue} className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Continue Session</button>
          <button type="button" onClick={onRegenerate} className="rounded-md border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-800">Regenerate Prediction</button>
          <button type="button" onClick={onPrint} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Print Kundli</button>
          <button type="button" onClick={onShare} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">WhatsApp Share</button>
        </div>
      </div>
    </section>
  )
}

export default CustomerProfileCard
