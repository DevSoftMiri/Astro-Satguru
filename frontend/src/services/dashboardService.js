import api from './api'

export const dashboardService = {
  admin: (params) => api.get('/analytics/dashboard', { params }).then((res) => res.data),
  revenue: (params) => api.get('/analytics/revenue', { params }).then((res) => res.data),
  monthly: (params) => api.get('/analytics/monthly', { params }).then((res) => res.data),
}
