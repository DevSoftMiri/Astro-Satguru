export const analyticsSeries = [
  { name: 'Jan', consultations: 120, revenue: 92000 },
  { name: 'Feb', consultations: 138, revenue: 118000 },
  { name: 'Mar', consultations: 164, revenue: 142000 },
  { name: 'Apr', consultations: 155, revenue: 132000 },
  { name: 'May', consultations: 188, revenue: 171000 },
  { name: 'Jun', consultations: 216, revenue: 198000 },
]

export const customers = [
  { id: '1', name: 'Ananya Sharma', phone: '+91 98765 43210', dob: '1995-06-12', plan: 'Two Questions', remaining: 1, astrologer: 'Acharya Dev', status: 'ACTIVE' },
  { id: '2', name: 'Rohan Mehta', phone: '+91 91234 56780', dob: '1989-11-04', plan: 'Unlimited Questions', remaining: 'Unlimited', astrologer: 'Jyoti Rao', status: 'ACTIVE' },
  { id: '3', name: 'Meera Nair', phone: '+91 99880 77665', dob: '1992-02-22', plan: 'One Question', remaining: 0, astrologer: 'Acharya Dev', status: 'INACTIVE' },
]

export const consultations = [
  { id: 'c1', customer: 'Ananya Sharma', astrologer: 'Acharya Dev', question: 'Marriage consultation', status: 'COMPLETED', payment: 'PAID', amount: '₹1,100', followUp: '2026-06-02' },
  { id: 'c2', customer: 'Rohan Mehta', astrologer: 'Jyoti Rao', question: 'Career change', status: 'IN_PROGRESS', payment: 'PENDING', amount: '₹2,500', followUp: '2026-05-30' },
  { id: 'c3', customer: 'Meera Nair', astrologer: 'Acharya Dev', question: 'Health follow-up', status: 'FOLLOW_UP', payment: 'PAID', amount: '₹700', followUp: '2026-06-08' },
]

export const astrologers = [
  { id: 'a1', name: 'Acharya Dev', email: 'dev@astrosatguru.com', phone: '+91 90000 11111', consultations: 342, revenue: '₹3.4L', status: 'ACTIVE' },
  { id: 'a2', name: 'Jyoti Rao', email: 'jyoti@astrosatguru.com', phone: '+91 90000 22222', consultations: 288, revenue: '₹2.8L', status: 'ACTIVE' },
]

export const timeline = [
  { id: 't1', date: '12 May', title: 'Marriage consultation', astrologer: 'Acharya Dev', status: 'COMPLETED', notes: 'Asked about matching, timing, and family acceptance. Suggested Friday Lakshmi puja.' },
  { id: 't2', date: '20 May', title: 'Career consultation', astrologer: 'Jyoti Rao', status: 'COMPLETED', notes: 'Discussed job transition window and pending questions under current plan.' },
  { id: 't3', date: '25 May', title: 'Follow-up', astrologer: 'Acharya Dev', status: 'FOLLOW_UP', notes: 'Follow-up reminder created with payment pending check.' },
]
