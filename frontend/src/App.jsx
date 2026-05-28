import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Astrologers from './pages/admin/Astrologers.jsx'
import AdminCustomers from './pages/admin/AdminCustomers.jsx'
import AdminConsultations from './pages/admin/AdminConsultations.jsx'
import Payments from './pages/admin/Payments.jsx'
import Reports from './pages/admin/Reports.jsx'
import Analytics from './pages/admin/Analytics.jsx'
import Settings from './pages/admin/Settings.jsx'
import AstrologerDashboard from './pages/astrologer/AstrologerDashboard.jsx'
import AddCustomer from './pages/astrologer/AddCustomer.jsx'
import CustomerHistory from './pages/astrologer/CustomerHistory.jsx'
import AstrologerConsultations from './pages/astrologer/AstrologerConsultations.jsx'
import FollowUps from './pages/astrologer/FollowUps.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/astrologers" element={<ProtectedRoute roles={['ADMIN']}><Astrologers /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute roles={['ADMIN']}><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/consultations" element={<ProtectedRoute roles={['ADMIN']}><AdminConsultations /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute roles={['ADMIN']}><Payments /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute roles={['ADMIN']}><Analytics /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute roles={['ADMIN']}><Settings /></ProtectedRoute>} />
            <Route path="/astrologer/dashboard" element={<ProtectedRoute roles={['ASTROLOGER']}><AstrologerDashboard /></ProtectedRoute>} />
            <Route path="/astrologer/add-customer" element={<ProtectedRoute roles={['ASTROLOGER']}><AddCustomer /></ProtectedRoute>} />
            <Route path="/astrologer/customer-history" element={<ProtectedRoute roles={['ASTROLOGER']}><CustomerHistory /></ProtectedRoute>} />
            <Route path="/astrologer/consultations" element={<ProtectedRoute roles={['ASTROLOGER']}><AstrologerConsultations /></ProtectedRoute>} />
            <Route path="/astrologer/follow-ups" element={<ProtectedRoute roles={['ASTROLOGER']}><FollowUps /></ProtectedRoute>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
