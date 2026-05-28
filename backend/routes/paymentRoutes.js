import express from 'express'
import { addPayment, getPayments, updatePayment } from '../controllers/paymentController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { paymentSchema, updatePaymentSchema } from '../validators/paymentValidators.js'

const router = express.Router()

router.use(protect)
router.get('/', authorize('ADMIN', 'ASTROLOGER'), getPayments)
router.post('/', authorize('ADMIN', 'ASTROLOGER'), validate(paymentSchema), addPayment)
router.put('/:id', authorize('ADMIN'), validate(updatePaymentSchema), updatePayment)

export default router
