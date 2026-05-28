import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { cookieOptions, signToken } from '../utils/token.js'
import { logActivity } from '../services/activityService.js'

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (user.status !== 'ACTIVE') throw new ApiError(403, 'Account is inactive')

  user.lastLoginAt = new Date()
  await user.save()
  const token = signToken(user)
  res.cookie('token', token, cookieOptions()).json({ success: true, token, user: publicUser(user) })
})

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token', cookieOptions()).json({ success: true, message: 'Logged out' })
})

export const createAstrologer = asyncHandler(async (req, res) => {
  const user = await User.create({ ...req.body, role: 'ASTROLOGER', createdBy: req.user._id })
  await logActivity({ actor: req.user._id, action: 'CREATE_ASTROLOGER', entityType: 'User', entityId: user._id })
  res.status(201).json({ success: true, user: publicUser(user) })
})

export const resetAstrologerPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'ASTROLOGER' })
  if (!user) throw new ApiError(404, 'Astrologer not found')
  user.password = req.body.password
  user.passwordResetRequired = true
  await user.save()
  await logActivity({ actor: req.user._id, action: 'RESET_ASTROLOGER_PASSWORD', entityType: 'User', entityId: user._id })
  res.json({ success: true, message: 'Password reset successfully' })
})

export const deactivateAstrologer = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'ASTROLOGER' }, { status: 'INACTIVE' }, { new: true })
  if (!user) throw new ApiError(404, 'Astrologer not found')
  await logActivity({ actor: req.user._id, action: 'DEACTIVATE_ASTROLOGER', entityType: 'User', entityId: user._id })
  res.json({ success: true, user: publicUser(user) })
})

export const activateAstrologer = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'ASTROLOGER' }, { status: 'ACTIVE' }, { new: true })
  if (!user) throw new ApiError(404, 'Astrologer not found')
  await logActivity({ actor: req.user._id, action: 'ACTIVATE_ASTROLOGER', entityType: 'User', entityId: user._id })
  res.json({ success: true, user: publicUser(user) })
})

export const forgotPassword = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: 'Forgot password provider hook is ready for email or SMS OTP integration' })
})
