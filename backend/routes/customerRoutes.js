import express from 'express'
import { createCustomer, deleteCustomer, getCustomer, getCustomerHistory, getCustomers, searchCustomer, updateCustomer } from '../controllers/customerController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createCustomerSchema, updateCustomerSchema } from '../validators/customerValidators.js'

const router = express.Router()

router.use(protect)
router.get('/', getCustomers)
router.get('/search', searchCustomer)
router.post('/', authorize('ADMIN', 'ASTROLOGER'), validate(createCustomerSchema), createCustomer)
router.get('/:id', getCustomer)
router.get('/:id/history', getCustomerHistory)
router.put('/:id', authorize('ADMIN', 'ASTROLOGER'), validate(updateCustomerSchema), updateCustomer)
router.delete('/:id', authorize('ADMIN'), deleteCustomer)

export default router
