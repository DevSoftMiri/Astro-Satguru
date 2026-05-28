import Notification from '../models/Notification.js'

export const queueNotification = async ({ recipient, channel, template, payload, scheduledFor }) => {
  return Notification.create({ recipient, channel, template, payload, scheduledFor })
}

export const providers = {
  whatsapp: 'Add WhatsApp Business API adapter here',
  email: 'Add SMTP or transactional email adapter here',
  sms: 'Add SMS gateway adapter here',
}
