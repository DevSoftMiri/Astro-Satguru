import api from './api'

export const astrologerService = {
  list: () => api.get('/users/astrologers').then((res) => res.data),
  create: (payload) => api.post('/auth/astrologers', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/users/astrologers/${id}`, payload).then((res) => res.data),
  resetPassword: (id, password) =>
    api.patch(`/auth/astrologers/${id}/reset-password`, { password }).then((res) => res.data),
  activate: (id) => api.patch(`/auth/astrologers/${id}/activate`).then((res) => res.data),
  deactivate: (id) => api.patch(`/auth/astrologers/${id}/deactivate`).then((res) => res.data),
}
