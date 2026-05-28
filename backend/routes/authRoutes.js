import express from 'express'
import { activateAstrologer, createAstrologer, deactivateAstrologer, forgotPassword, login, logout, resetAstrologerPassword } from '../controllers/authController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createAstrologerSchema, loginSchema, resetPasswordSchema } from '../validators/authValidators.js'

const router = express.Router()

router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/astrologers', protect, authorize('ADMIN'), validate(createAstrologerSchema), createAstrologer)
router.patch('/astrologers/:id/reset-password', protect, authorize('ADMIN'), validate(resetPasswordSchema), resetAstrologerPassword)
router.patch('/astrologers/:id/activate', protect, authorize('ADMIN'), activateAstrologer)
router.patch('/astrologers/:id/deactivate', protect, authorize('ADMIN'), deactivateAstrologer)

export default router
