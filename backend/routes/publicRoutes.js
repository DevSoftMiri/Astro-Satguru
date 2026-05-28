import express from 'express'
import { createCtaLead, createJoinApplication, createNewsletterLead } from '../controllers/publicController.js'
import { validate } from '../middleware/validate.js'
import { ctaLeadSchema, joinApplicationSchema, newsletterSchema } from '../validators/publicValidators.js'

const router = express.Router()

router.post('/cta', validate(ctaLeadSchema), createCtaLead)
router.post('/newsletter', validate(newsletterSchema), createNewsletterLead)
router.post('/join', validate(joinApplicationSchema), createJoinApplication)

export default router
