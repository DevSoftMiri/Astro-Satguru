import express from 'express'
import { getAstrologers, updateAstrologer } from '../controllers/userController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, authorize('ADMIN'))
router.get('/astrologers', getAstrologers)
router.put('/astrologers/:id', updateAstrologer)

export default router
