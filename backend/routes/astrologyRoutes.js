import express from 'express'
import { calculateAstrology } from '../controllers/astrologyController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.post('/calculate', authorize('ADMIN', 'ASTROLOGER'), calculateAstrology)

export default router
