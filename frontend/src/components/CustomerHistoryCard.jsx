import { useMemo, useState } from 'react'
import { consultationService } from '../services/consultationService'

const planLabels = {
  ONE_QUESTION: 'One Question',
  TWO_QUESTIONS: 'Two Questions',
  UNLIMITED_QUESTIONS: 'Unlimited Questions',
}

const statusStyles = {
  NEW: 'bg-blue-50 text-blue-700 border-blue-100',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  FOLLOW_UP: 'bg-purple-50 text-purple-700 border-purple-100',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
}

const formatDate = (value) => {
  if (!value) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

const getConsultationId = (consultation) => consultation?._id || consultation?.id

function SummaryBlock({ title, children }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-700">{children}</div>
    </div>
  )
}

function StatusPill({ status }) {
  const label = status || 'NEW'
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[label] || statusStyles.NEW}`}>
      {label.replaceAll('_', ' ')}
    </span>
  )
}

function CustomerHistoryCard({ customer, visits = [] }) {
  const [consultationOverrides, setConsultationOverrides] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [noteDrafts, setNoteDrafts] = useState({})
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')

  const consultations = useMemo(
    () => visits
      .filter((item) => Array.isArray(item.questionsAsked) || item.customer)
      .map((item, index) => consultationOverrides[getConsultationId(item) || index] || item),
    [consultationOverrides, visits],
  )

  const planStats = useMemo(() => {
    if (!customer) return null
    const allowed = customer.questionsAllowed ?? (customer.questionPlan === 'UNLIMITED_QUESTIONS' ? -1 : undefined)
    const used = customer.questionsUsed ?? consultations.reduce((total, consultation) => total + (consultation.questionsAsked?.length || 0), 0)
    const remaining = customer.remainingQuestions ?? (allowed === -1 ? -1 : Math.max((allowed || 0) - used, 0))

    return {
      label: planLabels[customer.questionPlan] || customer.questionPlan || 'No plan selected',
      allowed,
      used,
      remaining,
    }
  }, [consultations, customer])

  if (!customer) return null

  const horoscope = customer.horoscopeData || {}
  const kundli = customer.kundliData || {}
  const reports = customer.generatedReports || []

  const saveNotes = async (consultation, fallbackIndex) => {
    const id = getConsultationId(consultation)
    const draftKey = id || fallbackIndex
    const notes = noteDrafts[draftKey] || ''
    setError('')

    if (!id) {
      setConsultationOverrides((current) => ({ ...current, [draftKey]: { ...consultation, notes } }))
      setEditingId(null)
      return
    }

    try {
      setSavingId(id)
      const response = await consultationService.update(id, { notes })
      setConsultationOverrides((current) => ({ ...current, [id]: response.consultation }))
      setEditingId(null)
    } catch {
      setError('Could not save consultation notes. Please try again.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-cosmic">Previous Client Found</p>
          <h2 className="text-lg font-semibold text-slate-950">Customer Consultations</h2>
        </div>
        <p className="text-sm text-slate-500">Last visit: {formatDate(customer.updatedAt || customer.createdAt)}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <SummaryBlock title="Plan">
          <p className="font-semibold text-slate-900">{planStats?.label}</p>
          <p>Allowed: {planStats?.allowed === -1 ? 'Unlimited' : planStats?.allowed ?? 'Not set'}</p>
        </SummaryBlock>
        <SummaryBlock title="Questions Used">
          <p className="text-2xl font-bold text-slate-950">{planStats?.used ?? 0}</p>
        </SummaryBlock>
        <SummaryBlock title="Remaining">
          <p className="text-2xl font-bold text-slate-950">{planStats?.remaining === -1 ? 'Unlimited' : planStats?.remaining ?? 0}</p>
        </SummaryBlock>
        <SummaryBlock title="Saved Reports">
          <p className="text-2xl font-bold text-slate-950">{reports.length}</p>
        </SummaryBlock>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[1.4fr_90px_130px_150px_170px] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 max-lg:hidden">
          <span>Customer Question Asked</span>
          <span>Count</span>
          <span>Status</span>
          <span>Plan Usage</span>
          <span>Actions</span>
        </div>

        {consultations.length ? consultations.map((consultation, index) => {
          const id = getConsultationId(consultation)
          const draftKey = id || index
          const questionCount = consultation.questionsAsked?.length || 0
          const isEditing = editingId === draftKey

          return (
            <article key={draftKey} className="border-t border-slate-200 px-4 py-4 first:border-t-0">
              <div className="grid gap-4 lg:grid-cols-[1.4fr_90px_130px_150px_170px] lg:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 lg:hidden">Customer Question Asked</p>
                  {questionCount ? (
                    <ul className="mt-1 space-y-1 text-sm text-slate-800">
                      {consultation.questionsAsked.map((question, questionIndex) => (
                        <li key={`${question}-${questionIndex}`}>{questionIndex + 1}. {question}</li>
                      ))}
                    </ul>
                  ) : <p className="mt-1 text-sm text-slate-500">No question recorded.</p>}
                  {!isEditing && (consultation.notes || consultation.internalNotes) && (
                    <p className="mt-2 rounded-md bg-slate-50 p-2 text-xs leading-5 text-slate-600">{consultation.notes || consultation.internalNotes}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 lg:hidden">Count</p>
                  <p className="text-sm font-semibold text-slate-900">{questionCount}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 lg:hidden">Status</p>
                  <StatusPill status={consultation.status} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 lg:hidden">Plan Usage</p>
                  <p className="text-sm text-slate-700">
                    {planStats?.used ?? questionCount} used / {planStats?.allowed === -1 ? 'Unlimited' : planStats?.allowed ?? questionCount}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(isEditing ? null : draftKey)
                      setNoteDrafts((current) => ({ ...current, [draftKey]: current[draftKey] ?? consultation.notes ?? consultation.internalNotes ?? '' }))
                    }}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    {isEditing ? 'Cancel' : 'Add Notes'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => saveNotes(consultation, index)} disabled={savingId === id} className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">
                      {savingId === id ? 'Saving...' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
              {isEditing && (
                <textarea
                  value={noteDrafts[draftKey] || ''}
                  onChange={(event) => setNoteDrafts((current) => ({ ...current, [draftKey]: event.target.value }))}
                  className="mt-3 min-h-24 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10"
                  placeholder="Add consultation notes"
                />
              )}
            </article>
          )
        }) : (
          <div className="border-t border-slate-200 px-4 py-5 text-sm text-slate-500">
            No consultations found for this customer yet.
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <SummaryBlock title="Saved Kundli">
          {kundli.lagna || kundli.moonSign ? (
            <>
              {kundli.chartSvg && (
                <div
                  className="mb-3 max-w-64 rounded-md border border-slate-200 bg-white p-2 [&_svg]:h-auto [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: kundli.chartSvg }}
                />
              )}
              <p>Lagna: {kundli.lagna || 'Not available'}</p>
              <p>Moon sign: {kundli.moonSign || 'Not available'}</p>
              <p>Nakshatra: {kundli.nakshatra || 'Not available'}</p>
            </>
          ) : 'No kundli data saved yet.'}
        </SummaryBlock>
        <SummaryBlock title="Previous Horoscope Summary">
          {horoscope.summary || 'No previous horoscope summary saved.'}
        </SummaryBlock>
      </div>
    </section>
  )
}

export default CustomerHistoryCard
