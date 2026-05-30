import api from './api'

export const consultationService = {
  update: (id, payload) => api.put(`/consultations/${id}`, payload).then((res) => res.data),
}
