import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles?.length && !roles.includes(user?.role)) {
    const fallback = user?.role === 'ASTROLOGER' ? '/astrologer/dashboard' : '/admin/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children || <Outlet />
}

export default ProtectedRoute
