import Consultation from '../models/Consultation.js'
import AstrologyHistory from '../models/AstrologyHistory.js'
import Customer from '../models/Customer.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { logActivity } from '../services/activityService.js'

const allowedByPlan = {
  ONE_QUESTION: 1,
  TWO_QUESTIONS: 2,
  UNLIMITED_QUESTIONS: -1,
}

export const createCustomer = asyncHandler(async (req, res) => {
  const exists = await Customer.findOne({ phone: req.body.phone })
  if (exists) throw new ApiError(409, 'Customer with this phone number already exists')
  const now = new Date()

  const customer = await Customer.create({
    ...req.body,
    visitHistory: [{ type: 'created', note: 'Customer profile created', createdAt: now }],
    questionsAllowed: allowedByPlan[req.body.questionPlan],
    createdBy: req.user._id,
  })
  await logActivity({ actor: req.user._id, action: 'CREATE_CUSTOMER', entityType: 'Customer', entityId: customer._id })
  res.status(201).json({ success: true, customer })
})

export const updateCustomer = asyncHandler(async (req, res) => {
  const payload = { ...req.body }
  if (payload.questionPlan) payload.questionsAllowed = allowedByPlan[payload.questionPlan]
  const customer = await Customer.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
  if (!customer) throw new ApiError(404, 'Customer not found')
  res.json({ success: true, customer })
})

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id)
  if (!customer) throw new ApiError(404, 'Customer not found')
  res.json({ success: true, message: 'Customer deleted' })
})

export const getCustomers = asyncHandler(async (req, res) => {
  const { search, status, from, to } = req.query
  const filter = {}
  if (search) {
    filter.$or = [
      { fullName: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ]
  }
  if (from || to) {
    filter.createdAt = {}
    if (from) filter.createdAt.$gte = new Date(from)
    if (to) filter.createdAt.$lte = new Date(to)
  }
  if (status === 'expired') filter.planExpiryDate = { $lt: new Date() }

  const customers = await Customer.find(filter).populate('createdBy', 'name email role').sort('-createdAt').limit(100)
  res.json({ success: true, customers })
})

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate('createdBy', 'name email role')
  if (!customer) throw new ApiError(404, 'Customer not found')
  res.json({ success: true, customer })
})

export const searchCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ phone: req.query.phone }).populate('createdBy', 'name email role')
  if (!customer) return res.json({ success: true, customer: null, consultations: [] })
  const consultations = await Consultation.find({ customer: customer._id }).populate('astrologer', 'name email').sort('-createdAt')
  res.json({ success: true, customer, consultations })
})

export const checkCustomerByPhone = asyncHandler(async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '')
  if (!/^\d{10}$/.test(phone)) throw new ApiError(400, 'Enter a valid 10 digit phone number')

  const customer = await Customer.findOne({ phone })
  if (!customer) return res.json({ success: true, exists: false })

  const astrologyHistory = await AstrologyHistory.find({ customerId: customer._id }).sort('-calculatedAt').limit(20)
  res.json({ success: true, exists: true, customer, astrologyHistory })
})

export const saveCustomerNotesByPhone = asyncHandler(async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '')
  if (!/^\d{10}$/.test(phone)) throw new ApiError(400, 'Enter a valid 10 digit phone number')

  const notes = req.body.notes || ''
  const now = new Date()
  let customer = await Customer.findOne({ phone })

  if (customer) {
    customer.notes = notes
    customer.visitHistory = [
      { type: 'note', note: notes || 'Notes updated', createdAt: now },
      ...(customer.visitHistory || []),
    ]
    await customer.save()
  } else {
    customer = await Customer.create({
      phone,
      fullName: req.body.fullName || `Customer ${phone}`,
      notes,
      questionPlan: 'ONE_QUESTION',
      questionsAllowed: allowedByPlan.ONE_QUESTION,
      createdBy: req.user._id,
      visitHistory: [
        { type: 'created', note: 'Customer profile created from DivineAPI UI', createdAt: now },
        { type: 'note', note: notes || 'Notes added', createdAt: now },
      ],
    })
    await logActivity({ actor: req.user._id, action: 'CREATE_CUSTOMER', entityType: 'Customer', entityId: customer._id })
  }

  const astrologyHistory = await AstrologyHistory.find({ customerId: customer._id }).sort('-calculatedAt').limit(20)
  res.json({ success: true, customer, astrologyHistory })
})

export const addCustomerProfile = asyncHandler(async (req, res) => {
  const phone = String(req.body.phone || '').replace(/\D/g, '')
  if (!phone) throw new ApiError(400, 'Phone number is required')

  const exists = await Customer.findOne({ phone })
  if (exists) throw new ApiError(409, 'Customer with this phone number already exists')

  const firstName = req.body.firstName?.trim() || ''
  const lastName = req.body.lastName?.trim() || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || req.body.fullName
  const parsedTzone = Number.parseFloat(req.body.tzone)
  const tzone = Number.isFinite(parsedTzone) ? parsedTzone : 5.5

  const customer = await Customer.create({
    phone,
    firstName,
    lastName,
    fullName,
    gender: req.body.gender,
    dob: req.body.dob,
    dateOfBirth: req.body.dob,
    tob: req.body.tob,
    timeOfBirth: req.body.tob,
    placeOfBirth: req.body.placeOfBirth,
    lat: req.body.lat,
    lon: req.body.lon,
    tzone,
    birthLatitude: req.body.lat,
    birthLongitude: req.body.lon,
    birthTimezoneOffset: String(tzone),
    questionPlan: req.body.questionPlan || 'ONE_QUESTION',
    questionsAllowed: allowedByPlan[req.body.questionPlan] ?? allowedByPlan.ONE_QUESTION,
    createdBy: req.user._id,
    visitHistory: [{ type: 'created', note: 'Customer profile created', createdAt: new Date() }],
  })

  await logActivity({ actor: req.user._id, action: 'CREATE_CUSTOMER', entityType: 'Customer', entityId: customer._id })
  res.status(201).json({ success: true, customer })
})

const toVedAstroDate = (value) => {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const buildVedAstroTime = ({ time, date, timezoneOffset = '+05:30' }) => `${time} ${toVedAstroDate(date)} ${timezoneOffset}`

const isSvgMarkup = (value) => typeof value === 'string' && /<svg[\s>]/i.test(value)

export const generateKundliChart = asyncHandler(async (req, res) => {
  const { time, date, location, latitude, longitude, chartType = 'RasiD1', ayanamsa = 'RAMAN', timezoneOffset = '+05:30' } = req.body

  if (!time || !date || !location) {
    throw new ApiError(400, 'Time, date, and location are required to generate Kundli chart')
  }

  const locationPayload = {
    Name: location,
  }

  if (Number.isFinite(Number(latitude))) locationPayload.Latitude = Number(latitude)
  if (Number.isFinite(Number(longitude))) locationPayload.Longitude = Number(longitude)

  const response = await fetch(`${process.env.VEDASTRO_API_URL || 'https://api.vedastro.org'}/api/Calculate/NorthIndianChart`, {
    method: 'POST',
    headers: {
      Accept: 'image/svg+xml',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Time: {
        StdTime: buildVedAstroTime({ time, date, timezoneOffset }),
        Location: locationPayload,
      },
      ChartType: chartType,
      Ayanamsa: ayanamsa,
    }),
  })

  const svg = await response.text()
  if (!response.ok || !isSvgMarkup(svg)) {
    throw new ApiError(response.status || 502, 'VedAstro did not return a valid Kundli SVG chart')
  }

  res.type('image/svg+xml').send(svg)
})

export const saveHoroscopeData = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer) throw new ApiError(404, 'Customer not found')
  if (req.body.mobileNumber && req.body.mobileNumber !== customer.phone) throw new ApiError(400, 'Mobile number does not match this customer')

  const now = new Date()
  const report = {
    id: `${customer._id}-${now.getTime()}`,
    createdAt: req.body.createdAt || now,
    horoscopeData: req.body.horoscopeData || null,
    kundliData: req.body.kundliData || null,
    matchHistory: req.body.matchHistory || [],
    aiAstrologerChats: req.body.aiAstrologerChats || [],
    goodTimeFinder: req.body.goodTimeFinder || [],
    source: req.body.source || 'vedastro',
  }

  customer.horoscopeData = req.body.horoscopeData || customer.horoscopeData
  customer.kundliData = req.body.kundliData || customer.kundliData
  customer.matchHistory = req.body.matchHistory?.length
    ? [...req.body.matchHistory, ...(customer.matchHistory || [])]
    : customer.matchHistory
  customer.aiAstrologerChats = req.body.aiAstrologerChats || customer.aiAstrologerChats
  customer.generatedReports = [report, ...(customer.generatedReports || [])]
  customer.visitHistory = [
    { type: 'generated', note: 'Generated astrology data', createdAt: now },
    ...(customer.visitHistory || []),
  ]

  await customer.save()
  res.json({ success: true, customer })
})

export const getCustomerHistory = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer) throw new ApiError(404, 'Customer not found')
  const consultations = await Consultation.find({ customer: customer._id }).populate('astrologer', 'name email').sort('-createdAt')
  const astrologyHistory = await AstrologyHistory.find({ customerId: customer._id }).sort('-calculatedAt').limit(50)
  res.json({ success: true, customer, consultations, astrologyHistory })
})
