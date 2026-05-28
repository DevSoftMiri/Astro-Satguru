import { z } from 'zod'

const customerBody = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say']).optional(),
  dateOfBirth: z.coerce.date().optional(),
  timeOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  questionPlan: z.enum(['ONE_QUESTION', 'TWO_QUESTIONS', 'UNLIMITED_QUESTIONS']),
  planExpiryDate: z.coerce.date().optional(),
})

export const createCustomerSchema = z.object({ body: customerBody })
export const updateCustomerSchema = z.object({ body: customerBody.partial() })
