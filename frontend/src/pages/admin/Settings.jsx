import PageHeader from '../../components/PageHeader.jsx'

function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Security, notification channels, integrations, and organization settings." />
      <div className="grid gap-4 lg:grid-cols-2">
        {['HTTP-only cookies and JWT expiration', 'WhatsApp, SMS, and email notification providers', 'Cloudinary uploads for PDFs, images, and voice notes', 'Future Kundli, AI suggestions, subscriptions, multilingual support'].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">{item}</h2>
            <p className="mt-2 text-sm text-slate-500">Backend services and environment placeholders are prepared for this module.</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Settings
