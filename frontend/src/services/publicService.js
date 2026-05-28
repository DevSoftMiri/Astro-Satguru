import api from './api'

export const publicService = {
  trackCta: (intent, metadata = {}) =>
    api.post('/public/cta', { intent, source: 'home', metadata }).then((res) => res.data),
  newsletter: (email) => api.post('/public/newsletter', { email }).then((res) => res.data),
  join: (payload) => api.post('/public/join', payload).then((res) => res.data),
}
