import Consultation from '../models/Consultation.js'
import Customer from '../models/Customer.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { logActivity } from '../services/activityService.js'

export const createConsultation = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.body.customer)
  if (!customer) throw new ApiError(404, 'Customer not found')
  if (customer.questionsAllowed !== -1 && customer.questionsUsed >= customer.questionsAllowed) {
    throw new ApiError(400, 'Customer question plan has no remaining questions')
  }

  const consultation = await Consultation.create({
    ...req.body,
    astrologer: req.body.astrologer || req.user._id,
  })

  if (req.body.questionsAsked?.length) {
    customer.questionsUsed += req.body.questionsAsked.length
    await customer.save()
  }

  await logActivity({ actor: req.user._id, action: 'CREATE_CONSULTATION', entityType: 'Consultation', entityId: consultation._id })
  res.status(201).json({ success: true, consultation })
})

export const updateConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!consultation) throw new ApiError(404, 'Consultation not found')
  res.json({ success: true, consultation })
})

export const getConsultations = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.user.role === 'ASTROLOGER') filter.astrologer = req.user._id
  if (req.query.status) filter.status = req.query.status
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus
  if (req.query.from || req.query.to) {
    filter.createdAt = {}
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from)
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to)
  }
  const consultations = await Consultation.find(filter).populate('customer', 'fullName phone').populate('astrologer', 'name email').sort('-createdAt').limit(100)
  res.json({ success: true, consultations })
})

export const getConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.findById(req.params.id).populate('customer').populate('astrologer', 'name email')
  if (!consultation) throw new ApiError(404, 'Consultation not found')
  res.json({ success: true, consultation })
})
