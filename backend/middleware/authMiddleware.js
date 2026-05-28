import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, _res, next) => {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null
  const token = req.cookies?.token || bearer

  if (!token) throw new ApiError(401, 'Authentication required')

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)
  if (!user || user.status !== 'ACTIVE') {
    throw new ApiError(401, 'User is inactive or no longer exists')
  }

  req.user = user
  next()
})

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'))
  }
  next()
}
