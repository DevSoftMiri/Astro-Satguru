import { useEffect, useState } from 'react'
import { Edit3, KeyRound, Plus, Power, PowerOff, X } from 'lucide-react'
import DataTable from '../../components/DataTable.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { astrologerService } from '../../services/astrologerService'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  status: 'ACTIVE',
  password: '',
}

function AstrologerModal({ mode, initialValues, onClose, onSubmit, saving }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues, password: '' })
  const isEdit = mode === 'edit'

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialization: form.specialization,
    }
    if (isEdit) payload.status = form.status
    if (!isEdit) payload.password = form.password
    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-lg bg-white p-5 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{isEdit ? 'Edit Astrologer' : 'Create Astrologer'}</h2>
            <p className="text-sm text-slate-500">{isEdit ? 'Update profile and specialization details.' : 'Create login credentials for a new astrologer.'}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email</span>
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" type="email" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</span>
            <input value={form.phone || ''} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Specialization</span>
            <input value={form.specialization || ''} onChange={(event) => setForm({ ...form, specialization: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" />
          </label>
          {isEdit ? (
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Status</span>
              <select value={form.status || 'ACTIVE'} onChange={(event) => setForm({ ...form, status: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>
          ) : null}
          {!isEdit ? (
            <label className="block md:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Password</span>
              <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" type="password" minLength={8} required />
            </label>
          ) : null}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button disabled={saving} type="submit" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Account'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ResetPasswordModal({ astrologer, onClose, onSubmit, saving }) {
  const [password, setPassword] = useState('Astro@1234')

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={(event) => { event.preventDefault(); onSubmit(password) }} className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Reset Password</h2>
            <p className="text-sm text-slate-500">{astrologer.name}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">New Password</span>
          <input value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" type="text" minLength={8} required />
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
          <button disabled={saving} type="submit" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Astrologers() {
  const [astrologers, setAstrologers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modal, setModal] = useState(null)

  const loadAstrologers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await astrologerService.list()
      setAstrologers(data.astrologers || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load astrologers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial API synchronization for this page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAstrologers()
  }, [])

  const closeModal = () => setModal(null)

  const handleCreate = async (payload) => {
    setSaving(true)
    setError('')
    try {
      await astrologerService.create(payload)
      setSuccess('Astrologer created successfully')
      closeModal()
      await loadAstrologers()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create astrologer')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (payload) => {
    setSaving(true)
    setError('')
    try {
      await astrologerService.update(modal.astrologer._id, payload)
      setSuccess('Astrologer updated successfully')
      closeModal()
      await loadAstrologers()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update astrologer')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async (password) => {
    setSaving(true)
    setError('')
    try {
      await astrologerService.resetPassword(modal.astrologer._id, password)
      setSuccess(`Password reset for ${modal.astrologer.name}`)
      closeModal()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (astrologer) => {
    setSaving(true)
    setError('')
    try {
      await astrologerService.deactivate(astrologer._id)
      setSuccess(`${astrologer.name} deactivated`)
      await loadAstrologers()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to deactivate astrologer')
    } finally {
      setSaving(false)
    }
  }

  const handleActivate = async (astrologer) => {
    setSaving(true)
    setError('')
    try {
      await astrologerService.activate(astrologer._id)
      setSuccess(`${astrologer.name} activated`)
      await loadAstrologers()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to activate astrologer')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
      { key: 'specialization', label: 'Specialization', render: (row) => row.specialization || '-' },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge value={row.status} /> },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setModal({ type: 'edit', astrologer: row })} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700" type="button">
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
            <button onClick={() => setModal({ type: 'reset', astrologer: row })} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700" type="button">
              <KeyRound className="h-3.5 w-3.5" /> Reset
            </button>
            {row.status === 'INACTIVE' ? (
              <button disabled={saving} onClick={() => handleActivate(row)} className="inline-flex items-center gap-1 rounded-md border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50" type="button">
                <Power className="h-3.5 w-3.5" /> Activate
              </button>
            ) : (
              <button disabled={saving} onClick={() => handleDeactivate(row)} className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-50" type="button">
                <PowerOff className="h-3.5 w-3.5" /> Deactivate
              </button>
            )}
          </div>
        ),
      },
    ]

  return (
    <>
      <PageHeader
        title="Astrologers"
        description="Create accounts, reset passwords, deactivate users, and view performance."
        actions={<button onClick={() => setModal({ type: 'create' })} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white" type="button"><Plus className="h-4 w-4" /> Create Astrologer</button>}
      />
      {error ? <div className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}
      {success ? <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{success}</div> : null}
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500">Loading astrologers...</div>
      ) : (
        <DataTable columns={columns} rows={astrologers} />
      )}
      {modal?.type === 'create' ? <AstrologerModal mode="create" onClose={closeModal} onSubmit={handleCreate} saving={saving} /> : null}
      {modal?.type === 'edit' ? <AstrologerModal mode="edit" initialValues={modal.astrologer} onClose={closeModal} onSubmit={handleUpdate} saving={saving} /> : null}
      {modal?.type === 'reset' ? <ResetPasswordModal astrologer={modal.astrologer} onClose={closeModal} onSubmit={handleReset} saving={saving} /> : null}
    </>
  )
}

export default Astrologers
