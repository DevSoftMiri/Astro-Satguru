import Payment from '../models/Payment.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const addPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.create({ ...req.body, receivedBy: req.user._id })
  res.status(201).json({ success: true, payment })
})

export const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  res.json({ success: true, payment })
})

export const getPayments = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  const payments = await Payment.find(filter).populate('customer', 'fullName phone').populate('consultation').sort('-createdAt').limit(100)
  res.json({ success: true, payments })
})
