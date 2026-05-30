import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import KaalSarpYogWidget from '../../components/KaalSarpYogWidget.jsx'
import KundaliMatchingWidget from '../../components/KundaliMatchingWidget.jsx'
import KundliWidget from '../../components/KundliWidget.jsx'
import LoveCalculatorWidget from '../../components/LoveCalculatorWidget.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import api from '../../services/api'

const features = [
  {
    key: 'kundali',
    title: 'Kundali',
    description: 'Open the DivineAPI Kundli widget.',
    url: 'https://divineapi.com/login',
    embed: 'kundli',
  },
  {
    key: 'matching',
    title: 'Kundali Matching',
    description: 'Open the DivineAPI Kundali Matching widget.',
    url: 'https://support.divineapi.com/widgets/stepbystep-guide-to-access-and-customize-kundli-matching-widgets-using-your-dashboard',
    embed: 'matching',
  },
  {
    key: 'love_calculator',
    title: 'Love Calculator',
    description: 'Open the DivineAPI love compatibility widget.',
    url: 'https://support.divineapi.com/widgets/stepbystep-guide-to-access-and-customize-love-compatibility-widgets-using-your-dashboard',
    embed: 'love_calculator',
  },
  {
    key: 'kaal_sarp_yog',
    title: 'Kaal Sarp Yog Calculator',
    description: 'Open the DivineAPI Kaal Sarp Yog widget.',
    url: 'https://developers.divineapi.com/calculators',
    embed: 'kaal_sarp_yog',
  },
]

const normalizePhone = (phone = '') => phone.replace(/\D/g, '')
const isValidPhone = (phone = '') => /^\d{10}$/.test(normalizePhone(phone))

function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`fixed right-5 top-5 z-50 rounded-md px-4 py-3 text-sm font-semibold shadow-lg ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-white'}`}>
      {toast.message}
    </div>
  )
}

function CustomerHistory({ history }) {
  if (!history.length) {
    return <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">No DivineAPI history found for this phone number.</p>
  }

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <article key={item._id || item.id} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold capitalize text-slate-900">{item.featureType?.replaceAll('_', ' ')}</p>
            <p className="text-xs font-semibold text-slate-500">{new Date(item.calculatedAt || item.createdAt).toLocaleString()}</p>
          </div>
          {item.notes && <p className="mt-2 text-sm text-slate-600">{item.notes}</p>}
        </article>
      ))}
    </div>
  )
}

function DivineApiPanel({ feature }) {
  if (!feature) return null

  if (feature.embed) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
          <a href={feature.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-slate-400">
            <ExternalLink className="h-4 w-4" />
            DivineAPI
          </a>
        </div>
        {feature.embed === 'kundli' && <KundliWidget />}
        {feature.embed === 'matching' && <KundaliMatchingWidget />}
        {feature.embed === 'love_calculator' && <LoveCalculatorWidget />}
        {feature.embed === 'kaal_sarp_yog' && <KaalSarpYogWidget />}
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
          <p className="mt-1 text-sm text-slate-500">DivineAPI opened in a new tab for this option.</p>
        </div>
        <a href={feature.url} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white">
          <ExternalLink className="h-4 w-4" />
          Open DivineAPI
        </a>
      </div>
    </section>
  )
}

function AddCustomer() {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [history, setHistory] = useState([])
  const [notes, setNotes] = useState('')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  const phoneDigits = normalizePhone(phone)
  const selectedFeatureMeta = features.find((feature) => feature.key === selectedFeature)

  const handlePhoneChange = (value) => {
    setPhone(normalizePhone(value).slice(0, 10))
    setCustomer(null)
    setSelectedFeature(null)
    setHistory([])
    setNotes('')
  }

  const handleCheckCustomer = async () => {
    if (!isValidPhone(phone)) {
      setToast({ type: 'error', message: 'Enter a valid 10 digit phone number.' })
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/customers/check', { phone: phoneDigits })
      if (response.data.exists) {
        setCustomer(response.data.customer)
        setNotes(response.data.customer.notes || '')
        setHistory(response.data.astrologyHistory || [])
        setToast({ type: 'success', message: 'Customer found. Choose a DivineAPI option.' })
      } else {
        setCustomer(null)
        setNotes('')
        setHistory([])
        setToast({ type: 'success', message: 'New phone number. Choose a DivineAPI option.' })
      }
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to check customer.' })
    } finally {
      setLoading(false)
    }
  }

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature.key)
    if (!feature.embed) {
      window.open(feature.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSaveNotes = async () => {
    if (!isValidPhone(phone)) {
      setToast({ type: 'error', message: 'Enter a valid 10 digit phone number.' })
      return
    }

    try {
      setSavingNotes(true)
      const response = await api.post('/customers/notes', { phone: phoneDigits, notes })
      setCustomer(response.data.customer)
      setHistory(response.data.astrologyHistory || [])
      setToast({ type: 'success', message: 'Customer notes saved.' })
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || 'Unable to save notes.' })
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <>
      <Toast toast={toast} />
      <PageHeader title="Add Customer" description="Check customer by phone, open DivineAPI UI, save notes, and view history." />

      <div className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number</span>
              <input value={phone} onChange={(event) => handlePhoneChange(event.target.value)} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" placeholder="10 digit customer phone" />
              {phone && !isValidPhone(phone) && <span className="mt-1 block text-xs font-semibold text-rose-600">Enter exactly 10 digits.</span>}
            </label>
            <button type="button" onClick={handleCheckCustomer} disabled={loading || !isValidPhone(phone)} className="h-11 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Checking...' : 'Check Customer'}
            </button>
          </div>
          {customer && (
            <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold text-slate-950">{customer.fullName || customer.name || `Customer ${phoneDigits}`}</span>
              {customer.placeOfBirth && (
                <>
                  <span className="mx-2 text-slate-400">|</span>
                  {customer.placeOfBirth}
                </>
              )}
            </div>
          )}
        </section>

        {isValidPhone(phone) && (
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Choose One DivineAPI Option</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {features.map((feature) => (
                <button
                  key={feature.key}
                  type="button"
                  onClick={() => handleFeatureSelect(feature)}
                  className={`rounded-md border p-4 text-left transition ${selectedFeature === feature.key ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'}`}
                >
                  <span className="block text-sm font-semibold">{feature.title}</span>
                  <span className={`mt-2 block text-xs leading-5 ${selectedFeature === feature.key ? 'text-slate-200' : 'text-slate-500'}`}>{feature.description}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <DivineApiPanel feature={selectedFeatureMeta} />

        {isValidPhone(phone) && (
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Astrologer Notes</h3>
              <button type="button" onClick={handleSaveNotes} disabled={savingNotes} className="rounded-md bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {savingNotes ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-4 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" placeholder="Add notes for this customer" />
          </section>
        )}

        {isValidPhone(phone) && (
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Customer DivineAPI History</h3>
            <CustomerHistory history={history} />
          </section>
        )}
      </div>
    </>
  )
}

export default AddCustomer
