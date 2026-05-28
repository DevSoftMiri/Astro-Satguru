import api from './api'

export const customerService = {
  list: (params) => api.get('/customers', { params }).then((res) => res.data),
  create: (payload) => api.post('/customers', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/customers/${id}`, payload).then((res) => res.data),
  searchByPhone: (phone) => api.get('/customers/search', { params: { phone } }).then((res) => res.data),
  history: (id) => api.get(`/customers/${id}/history`).then((res) => res.data),
}
