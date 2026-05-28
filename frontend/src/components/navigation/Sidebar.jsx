import { NavLink } from 'react-router-dom'
import { BarChart3, CalendarClock, CreditCard, LayoutDashboard, LineChart, Search, Settings, Star, UserPlus, Users, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/astrologers', label: 'Astrologers', icon: Star },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/consultations', label: 'Consultations', icon: CalendarClock },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/analytics', label: 'Analytics', icon: LineChart },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const astrologerNav = [
  { to: '/astrologer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/astrologer/add-customer', label: 'Add Customer', icon: UserPlus },
  { to: '/astrologer/customer-history', label: 'Customer History', icon: Search },
  { to: '/astrologer/consultations', label: 'Consultations', icon: CalendarClock },
  { to: '/astrologer/follow-ups', label: 'Follow-ups', icon: BarChart3 },
]

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user } = useAuth()
  const items = user?.role === 'ASTROLOGER' ? astrologerNav : adminNav

  return (
    <>
      <button
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        type="button"
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:z-30 lg:block lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-saffron text-lg font-bold text-white">AS</span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-slate-950">Astro Satguru</p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{user?.role || 'CRM'}</p>
              </div>
              <button
                className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-slate-500 lg:hidden"
                type="button"
                aria-label="Close menu"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-5">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-indigo-50 text-cosmic' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="m-4 rounded-lg bg-slate-950 p-4 text-white">
            <p className="text-sm font-semibold">Future-ready modules</p>
            <p className="mt-1 text-xs text-slate-300">WhatsApp, SMS, AI guidance, Kundli generation, subscriptions.</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
