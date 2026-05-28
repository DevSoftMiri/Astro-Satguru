export const ROLES = {
  ADMIN: 'ADMIN',
  ASTROLOGER: 'ASTROLOGER',
  SUPPORT: 'SUPPORT',
}

export const QUESTION_PLANS = {
  ONE_QUESTION: { label: 'One Question', allowed: 1 },
  TWO_QUESTIONS: { label: 'Two Questions', allowed: 2 },
  UNLIMITED_QUESTIONS: { label: 'Unlimited Questions', allowed: -1 },
}

export const CONSULTATION_STATUSES = ['NEW', 'IN_PROGRESS', 'COMPLETED', 'FOLLOW_UP', 'CLOSED']
export const PAYMENT_STATUSES = ['PAID', 'PENDING', 'FAILED', 'REFUNDED']
export const PAYMENT_METHODS = ['UPI', 'Cash', 'Card', 'Bank Transfer']
