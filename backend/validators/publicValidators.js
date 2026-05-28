import { z } from 'zod'

export const ctaLeadSchema = z.object({
  body: z.object({
    intent: z.string().min(2),
    source: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
})

export const newsletterSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
})

export const joinApplicationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    experience: z.coerce.number().nonnegative().optional(),
    social: z.string().optional(),
    about: z.string().optional(),
    resumeName: z.string().optional(),
  }),
})
