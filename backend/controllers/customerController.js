import Consultation from '../models/Consultation.js'
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

  const customer = await Customer.create({
    ...req.body,
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

export const getCustomerHistory = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if (!customer) throw new ApiError(404, 'Customer not found')
  const consultations = await Consultation.find({ customer: customer._id }).populate('astrologer', 'name email').sort('-createdAt')
  res.json({ success: true, customer, consultations })
})
