import express from 'express'
import { createConsultation, getConsultation, getConsultations, updateConsultation } from '../controllers/consultationController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { consultationSchema, updateConsultationSchema } from '../validators/consultationValidators.js'

const router = express.Router()

router.use(protect)
router.get('/', getConsultations)
router.post('/', authorize('ADMIN', 'ASTROLOGER'), validate(consultationSchema), createConsultation)
router.get('/:id', getConsultation)
router.put('/:id', authorize('ADMIN', 'ASTROLOGER'), validate(updateConsultationSchema), updateConsultation)

export default router
