import express from 'express'
import { dashboardAnalytics, monthlyAnalytics, revenueAnalytics } from '../controllers/analyticsController.js'
import { authorize, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect, authorize('ADMIN'))
router.get('/dashboard', dashboardAnalytics)
router.get('/revenue', revenueAnalytics)
router.get('/monthly', monthlyAnalytics)

export default router
