import Consultation from '../models/Consultation.js'
import Customer from '../models/Customer.js'
import Payment from '../models/Payment.js'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const dashboardAnalytics = asyncHandler(async (_req, res) => {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const [totalCustomers, todayCustomers, monthlyCustomers, totalAstrologers, totalConsultations, pendingConsultations, completedConsultations, revenue] = await Promise.all([
    Customer.countDocuments(),
    Customer.countDocuments({ createdAt: { $gte: startOfToday } }),
    Customer.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ role: 'ASTROLOGER' }),
    Consultation.countDocuments(),
    Consultation.countDocuments({ status: { $in: ['NEW', 'IN_PROGRESS', 'FOLLOW_UP'] } }),
    Consultation.countDocuments({ status: 'COMPLETED' }),
    Payment.aggregate([{ $match: { status: 'PAID' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ])

  res.json({
    success: true,
    metrics: {
      totalCustomers,
      todayCustomers,
      monthlyCustomers,
      totalAstrologers,
      totalConsultations,
      pendingConsultations,
      completedConsultations,
      revenue: revenue[0]?.total || 0,
    },
  })
})

export const revenueAnalytics = asyncHandler(async (_req, res) => {
  const data = await Payment.aggregate([
    { $match: { status: 'PAID' } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$amount' } } },
    { $sort: { _id: 1 } },
  ])
  res.json({ success: true, data })
})

export const monthlyAnalytics = asyncHandler(async (_req, res) => {
  const data = await Consultation.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, consultations: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ])
  res.json({ success: true, data })
})
