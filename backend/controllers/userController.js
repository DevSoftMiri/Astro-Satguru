import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const selectPublic = 'name email phone role status specialization createdAt lastLoginAt'

export const getAstrologers = asyncHandler(async (_req, res) => {
  const astrologers = await User.find({ role: 'ASTROLOGER' }).select(selectPublic).sort('-createdAt')
  res.json({ success: true, astrologers })
})

export const updateAstrologer = asyncHandler(async (req, res) => {
  const astrologer = await User.findOneAndUpdate({ _id: req.params.id, role: 'ASTROLOGER' }, req.body, { new: true, runValidators: true }).select(selectPublic)
  res.json({ success: true, astrologer })
})
