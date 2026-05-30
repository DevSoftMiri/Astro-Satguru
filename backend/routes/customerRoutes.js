import express from 'express'
import { addCustomerProfile, checkCustomerByPhone, createCustomer, deleteCustomer, generateKundliChart, getCustomer, getCustomerHistory, getCustomers, saveCustomerNotesByPhone, saveHoroscopeData, searchCustomer, updateCustomer } from '../controllers/customerController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import { createCustomerSchema, updateCustomerSchema } from '../validators/customerValidators.js'

const router = express.Router()

router.use(protect)
router.get('/', getCustomers)
router.get('/search', searchCustomer)
router.post('/check', authorize('ADMIN', 'ASTROLOGER'), checkCustomerByPhone)
router.post('/notes', authorize('ADMIN', 'ASTROLOGER'), saveCustomerNotesByPhone)
router.post('/add', authorize('ADMIN', 'ASTROLOGER'), addCustomerProfile)
router.post('/kundli-chart', authorize('ADMIN', 'ASTROLOGER'), generateKundliChart)
router.post('/', authorize('ADMIN', 'ASTROLOGER'), validate(createCustomerSchema), createCustomer)
router.get('/:id', getCustomer)
router.get('/:id/history', getCustomerHistory)
router.post('/:id/horoscope', authorize('ADMIN', 'ASTROLOGER'), saveHoroscopeData)
router.put('/:id', authorize('ADMIN', 'ASTROLOGER'), validate(updateCustomerSchema), updateCustomer)
router.delete('/:id', authorize('ADMIN'), deleteCustomer)

export default router
