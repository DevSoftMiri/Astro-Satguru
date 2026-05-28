import { z } from 'zod'

const consultationBody = z.object({
    customer: z.string(),
    astrologer: z.string().optional(),
    questionsAsked: z.array(z.string()).default([]),
    remedies: z.string().optional(),
    notes: z.string().optional(),
    internalNotes: z.string().optional(),
    status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'FOLLOW_UP', 'CLOSED']).optional(),
    followUpDate: z.coerce.date().optional(),
    paymentStatus: z.enum(['PAID', 'PENDING', 'FAILED', 'REFUNDED']).optional(),
    amount: z.number().nonnegative().optional(),
})

export const consultationSchema = z.object({
  body: consultationBody,
})

export const updateConsultationSchema = z.object({
  body: consultationBody.partial(),
})
