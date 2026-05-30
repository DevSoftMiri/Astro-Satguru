import axios from 'axios'
import AstrologyHistory from '../models/AstrologyHistory.js'
import Customer from '../models/Customer.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const featureEndpoints = {
  kundali: 'https://astroapi-3.divineapi.com/indian-api/v1/horoscope-chart/D1',
  matching: 'https://astroapi-3.divineapi.com/indian-api/v2/ashtakoot-milan',
  love_calculator: 'https://astroapi-7.divineapi.com/calculator/v1/love-calculator',
  kaal_sarp_yog: 'https://astroapi-3.divineapi.com/indian-api/v1/kaal-sarpa-yoga',
}

const normalizeGender = (gender = '') => gender.toLowerCase().startsWith('m') ? 'male' : 'female'

const splitDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) throw new ApiError(400, 'Customer date of birth is required')
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  }
}

const splitTime = (value = '') => {
  const [hour = '0', min = '0', sec = '0'] = value.split(':')
  return {
    hour: Number(hour) || 0,
    min: Number(min) || 0,
    sec: Number(sec) || 0,
  }
}

const fullName = (customer) => customer.fullName || [customer.firstName, customer.lastName].filter(Boolean).join(' ')

const parseTzone = (customer) => {
  const rawValue = customer.tzone ?? customer.birthTimezoneOffset
  const parsed = Number.parseFloat(rawValue)
  return Number.isFinite(parsed) ? parsed : 5.5
}

const normalizePhone = (phone = '') => String(phone).replace(/\D/g, '')

const normalizedCustomerPayload = (payload = {}, phone) => {
  const firstName = payload.firstName?.trim() || ''
  const lastName = payload.lastName?.trim() || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || payload.fullName?.trim() || `Customer ${phone}`
  const parsedTzone = Number.parseFloat(payload.tzone ?? payload.birthTimezoneOffset)
  const tzone = Number.isFinite(parsedTzone) ? parsedTzone : 5.5

  const normalized = {
    phone,
    firstName,
    lastName,
    fullName,
    gender: payload.gender || 'Female',
    tzone,
    birthTimezoneOffset: String(tzone),
    questionPlan: payload.questionPlan || 'ONE_QUESTION',
    questionsAllowed: 1,
  }

  if (payload.dob || payload.dateOfBirth) {
    normalized.dob = payload.dob || payload.dateOfBirth
    normalized.dateOfBirth = payload.dob || payload.dateOfBirth
  }
  if (payload.tob || payload.timeOfBirth) {
    normalized.tob = payload.tob || payload.timeOfBirth
    normalized.timeOfBirth = payload.tob || payload.timeOfBirth
  }
  if (payload.placeOfBirth) normalized.placeOfBirth = payload.placeOfBirth
  if (payload.lat !== '' && payload.lat !== undefined) {
    normalized.lat = payload.lat
    normalized.birthLatitude = payload.lat
  }
  if (payload.lon !== '' && payload.lon !== undefined) {
    normalized.lon = payload.lon
    normalized.birthLongitude = payload.lon
  }

  return normalized
}

const upsertCustomerForCalculation = async ({ customerId, phone, customerData, notes, userId }) => {
  if (customerId) {
    const existing = await Customer.findById(customerId)
    if (!existing) throw new ApiError(404, 'Customer not found')
    const payload = normalizedCustomerPayload(customerData, existing.phone)
    Object.assign(existing, payload, {
      notes: notes ?? existing.notes,
      visitHistory: notes
        ? [{ type: 'note', note: notes, createdAt: new Date() }, ...(existing.visitHistory || [])]
        : existing.visitHistory,
    })
    await existing.save()
    return existing
  }

  const normalized = normalizePhone(phone)
  if (!/^\d{10}$/.test(normalized)) throw new ApiError(400, 'Enter a valid 10 digit phone number')

  const existing = await Customer.findOne({ phone: normalized })
  if (existing) {
    const payload = normalizedCustomerPayload(customerData, normalized)
    Object.assign(existing, payload, {
      notes: notes ?? existing.notes,
      visitHistory: notes
        ? [{ type: 'note', note: notes, createdAt: new Date() }, ...(existing.visitHistory || [])]
        : existing.visitHistory,
    })
    await existing.save()
    return existing
  }

  return Customer.create({
    ...normalizedCustomerPayload(customerData, normalized),
    notes,
    createdBy: userId,
    visitHistory: [
      { type: 'created', note: 'Customer profile created from DivineAPI form', createdAt: new Date() },
      ...(notes ? [{ type: 'note', note: notes, createdAt: new Date() }] : []),
    ],
  })
}

const baseBirthPayload = (customer) => {
  const date = splitDate(customer.dob || customer.dateOfBirth)
  const time = splitTime(customer.tob || customer.timeOfBirth)
  const lat = customer.lat ?? customer.birthLatitude
  const lon = customer.lon ?? customer.birthLongitude
  if (!customer.placeOfBirth || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) {
    throw new ApiError(400, 'Customer birth place, latitude, and longitude are required')
  }

  return {
    full_name: fullName(customer),
    ...date,
    ...time,
    gender: normalizeGender(customer.gender),
    place: customer.placeOfBirth,
    lat,
    lon,
    tzone: parseTzone(customer),
    lan: 'en',
  }
}

const prefixedBirthPayload = (prefix, data) => ({
  [`${prefix}_full_name`]: data.full_name,
  [`${prefix}_day`]: data.day,
  [`${prefix}_month`]: data.month,
  [`${prefix}_year`]: data.year,
  [`${prefix}_hour`]: data.hour,
  [`${prefix}_min`]: data.min,
  [`${prefix}_sec`]: data.sec,
  [`${prefix}_gender`]: data.gender,
  [`${prefix}_place`]: data.place,
  [`${prefix}_lat`]: data.lat,
  [`${prefix}_lon`]: data.lon,
  [`${prefix}_tzone`]: data.tzone,
})

const partnerPayload = (partner = {}) => {
  if (!partner.fullName || !partner.dob || !partner.tob || !partner.placeOfBirth) {
    throw new ApiError(400, 'Partner name, date, time, and place are required for this calculation')
  }

  const date = splitDate(partner.dob)
  const time = splitTime(partner.tob)
  return {
    full_name: partner.fullName,
    ...date,
    ...time,
    gender: normalizeGender(partner.gender),
    place: partner.placeOfBirth,
    lat: partner.lat,
    lon: partner.lon,
    tzone: partner.tzone,
  }
}

const buildInputData = (featureType, customer, extraInput = {}) => {
  const apiKey = process.env.DIVINE_API_KEY
  if (!apiKey) throw new ApiError(500, 'DIVINE_API_KEY is not configured')

  if (featureType === 'love_calculator') {
    const partner = extraInput.partner || {}
    if (!partner.fullName) throw new ApiError(400, 'Partner name is required for love calculator')
    return {
      api_key: apiKey,
      your_name: fullName(customer),
      your_gender: normalizeGender(customer.gender),
      partner_name: partner.fullName,
      partner_gender: normalizeGender(partner.gender),
    }
  }

  const birth = baseBirthPayload(customer)

  if (featureType === 'kundali') {
    return {
      api_key: apiKey,
      ...birth,
      chart_type: 'north',
      chart_style: 'north_india',
      style: 'north_india',
      show_planet_degree: 1,
      show_planet_retro: 1,
    }
  }

  if (featureType === 'kaal_sarp_yog') {
    return {
      api_key: apiKey,
      ...birth,
    }
  }

  if (featureType === 'matching') {
    const partner = partnerPayload(extraInput.partner)
    return {
      api_key: apiKey,
      ...prefixedBirthPayload('p1', birth),
      ...prefixedBirthPayload('p2', partner),
      chart_type: 'north',
      chart_style: 'north_india',
      style: 'north_india',
      lan: 'en',
    }
  }

  throw new ApiError(400, 'Unsupported astrology feature type')
}

const postToDivineApi = async (featureType, inputData) => {
  const accessToken = process.env.DIVINE_API_ACCESS_TOKEN || process.env.DIVINE_API_TOKEN
  if (!accessToken) throw new ApiError(500, 'DIVINE_API_ACCESS_TOKEN is not configured')

  const response = await axios.post(featureEndpoints[featureType], new URLSearchParams(inputData), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 30000,
  })

  return response.data
}

export const calculateAstrology = asyncHandler(async (req, res) => {
  const { customerId, phone, featureType, inputData: extraInput = {}, customerData = {}, notes = '' } = req.body
  if (!featureType) throw new ApiError(400, 'featureType is required')

  const customer = await upsertCustomerForCalculation({
    customerId,
    phone,
    customerData,
    notes,
    userId: req.user._id,
  })

  const inputData = buildInputData(featureType, customer, extraInput)
  const apiResponse = await postToDivineApi(featureType, inputData)

  const history = await AstrologyHistory.create({
    customerId: customer._id,
    featureType,
    inputData,
    apiResponse,
    notes,
    calculatedAt: new Date(),
  })

  customer.generatedReports = [
    {
      id: `${history._id}`,
      featureType,
      createdAt: history.calculatedAt,
      astrologyHistoryId: history._id,
      apiResponse,
      notes,
      source: 'divineapi',
    },
    ...(customer.generatedReports || []),
  ]
  customer.visitHistory = [
    { type: 'generated', note: `Generated ${featureType} calculation`, createdAt: history.calculatedAt },
    ...(customer.visitHistory || []),
  ]
  await customer.save()

  const astrologyHistory = await AstrologyHistory.find({ customerId: customer._id }).sort('-calculatedAt').limit(20)
  res.json({ success: true, data: apiResponse, history, customer, astrologyHistory })
})
