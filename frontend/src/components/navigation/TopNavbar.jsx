import { Bell, LogOut, Menu, Moon, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600 lg:hidden"
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <label className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-cosmic focus:ring-2 focus:ring-cosmic/10" placeholder="Global search" />
        </label>
        <div className="ml-auto flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600" type="button" aria-label="Toggle theme">
            <Moon className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-600" type="button" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <div className="hidden items-center gap-3 rounded-md border border-slate-200 px-3 py-1.5 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">{user?.name?.slice(0, 2) || 'AS'}</span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'ADMIN'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white" type="button" aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
