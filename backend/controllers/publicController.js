import PublicLead from '../models/PublicLead.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createCtaLead = asyncHandler(async (req, res) => {
  const lead = await PublicLead.create({
    type: 'CTA',
    intent: req.body.intent,
    metadata: {
      source: req.body.source || 'home',
      ...req.body.metadata,
    },
  })

  res.status(201).json({ success: true, message: 'Request received', leadId: lead._id })
})

export const createNewsletterLead = asyncHandler(async (req, res) => {
  const lead = await PublicLead.create({
    type: 'NEWSLETTER',
    email: req.body.email,
    intent: 'Weekly cosmic forecast newsletter',
  })

  res.status(201).json({ success: true, message: 'Newsletter subscription saved', leadId: lead._id })
})

export const createJoinApplication = asyncHandler(async (req, res) => {
  const lead = await PublicLead.create({
    type: 'JOIN_APPLICATION',
    name: req.body.name,
    phone: req.body.phone,
    experience: req.body.experience,
    social: req.body.social,
    about: req.body.about,
    resumeName: req.body.resumeName,
    intent: 'Astrologer join application',
  })

  res.status(201).json({ success: true, message: 'Application submitted successfully', leadId: lead._id })
})
