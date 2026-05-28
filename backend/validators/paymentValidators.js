import { z } from 'zod'

const paymentBody = z.object({
    customer: z.string(),
    consultation: z.string().optional(),
    amount: z.number().nonnegative(),
    method: z.enum(['UPI', 'Cash', 'Card', 'Bank Transfer']),
    transactionId: z.string().optional(),
    status: z.enum(['PAID', 'PENDING', 'FAILED', 'REFUNDED']).default('PENDING'),
    pendingDue: z.number().nonnegative().optional(),
})

export const paymentSchema = z.object({
  body: paymentBody,
})

export const updatePaymentSchema = z.object({
  body: paymentBody.partial(),
})
