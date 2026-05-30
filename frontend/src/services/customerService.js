import api from './api'

const STORAGE_KEY = 'astro_satguru_customers'

const readLocalCustomers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const writeLocalCustomers = (customers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
}

const normalizePhone = (phone = '') => phone.replace(/\D/g, '')

const buildLocalCustomer = (payload) => {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    _id: crypto.randomUUID(),
    mobileNumber: normalizePhone(payload.mobileNumber || payload.phone),
    phone: normalizePhone(payload.phone || payload.mobileNumber),
    name: payload.name || payload.fullName || '',
    fullName: payload.fullName || payload.name || '',
    gender: payload.gender || '',
    birthDate: payload.birthDate || payload.dateOfBirth || '',
    dateOfBirth: payload.dateOfBirth || payload.birthDate || '',
    birthTime: payload.birthTime || payload.timeOfBirth || '',
    timeOfBirth: payload.timeOfBirth || payload.birthTime || '',
    birthPlace: payload.birthPlace || payload.placeOfBirth || '',
    placeOfBirth: payload.placeOfBirth || payload.birthPlace || '',
    birthLatitude: payload.birthLatitude || '',
    birthLongitude: payload.birthLongitude || '',
    birthTimezoneOffset: payload.birthTimezoneOffset || '+05:30',
    horoscopeData: null,
    kundliData: null,
    matchHistory: [],
    aiAstrologerChats: [],
    generatedReports: [],
    visitHistory: [{ type: 'created', note: 'Customer profile created', createdAt: now }],
    notes: payload.notes || '',
    createdAt: now,
    updatedAt: now,
    ...payload,
  }
}

const withBackendFallback = async (request, fallback) => {
  try {
    return await request()
  } catch (error) {
    if (!error.response || error.code === 'ERR_NETWORK') return fallback()
    throw error
  }
}

export const customerService = {
  list: (params) => api.get('/customers', { params }).then((res) => res.data),
  create: (payload) => customerService.createCustomer(payload),
  update: (id, payload) => customerService.updateCustomer(id, payload),
  searchByPhone: (phone) => customerService.findCustomerByPhone(phone),
  history: (id) => customerService.getCustomerHistory(id),
  findCustomerByPhone: (phone) => withBackendFallback(
    () => api.get('/customers/search', { params: { phone: normalizePhone(phone) } }).then((res) => res.data),
    () => {
      const customer = readLocalCustomers().find((item) => normalizePhone(item.phone || item.mobileNumber) === normalizePhone(phone))
      return { success: true, customer: customer || null, consultations: customer?.visitHistory || [] }
    },
  ),
  createCustomer: (payload) => withBackendFallback(
    () => api.post('/customers', payload).then((res) => res.data),
    () => {
      const customers = readLocalCustomers()
      const customer = buildLocalCustomer(payload)
      writeLocalCustomers([customer, ...customers])
      return { success: true, customer }
    },
  ),
  updateCustomer: (id, payload) => withBackendFallback(
    () => api.put(`/customers/${id}`, payload).then((res) => res.data),
    () => {
      const customers = readLocalCustomers()
      const nextCustomers = customers.map((customer) => {
        if ((customer._id || customer.id) !== id) return customer
        return {
          ...customer,
          ...payload,
          mobileNumber: normalizePhone(payload.mobileNumber || payload.phone || customer.mobileNumber),
          phone: normalizePhone(payload.phone || payload.mobileNumber || customer.phone),
          name: payload.name || payload.fullName || customer.name,
          fullName: payload.fullName || payload.name || customer.fullName,
          updatedAt: new Date().toISOString(),
        }
      })
      writeLocalCustomers(nextCustomers)
      return { success: true, customer: nextCustomers.find((customer) => (customer._id || customer.id) === id) }
    },
  ),
  saveHoroscopeData: (id, payload) => withBackendFallback(
    () => api.post(`/customers/${id}/horoscope`, payload).then((res) => res.data),
    () => {
      const now = new Date().toISOString()
      const customers = readLocalCustomers()
      const nextCustomers = customers.map((customer) => {
        if ((customer._id || customer.id) !== id) return customer
        const report = { id: crypto.randomUUID(), createdAt: now, ...payload }
        const nextMatchHistory = payload.matchHistory?.length
          ? [...payload.matchHistory, ...(customer.matchHistory || [])]
          : customer.matchHistory || []
        return {
          ...customer,
          horoscopeData: payload.horoscopeData || customer.horoscopeData,
          kundliData: payload.kundliData || customer.kundliData,
          matchHistory: nextMatchHistory,
          aiAstrologerChats: payload.aiAstrologerChats || customer.aiAstrologerChats || [],
          generatedReports: [report, ...(customer.generatedReports || [])],
          visitHistory: [{ type: 'generated', note: 'Generated astrology data', createdAt: now }, ...(customer.visitHistory || [])],
          updatedAt: now,
        }
      })
      writeLocalCustomers(nextCustomers)
      return { success: true, customer: nextCustomers.find((customer) => (customer._id || customer.id) === id) }
    },
  ),
  getCustomerHistory: (id) => withBackendFallback(
    () => api.get(`/customers/${id}/history`).then((res) => res.data),
    () => {
      const customer = readLocalCustomers().find((item) => (item._id || item.id) === id)
      return { success: true, customer, consultations: customer?.visitHistory || [] }
    },
  ),
}
