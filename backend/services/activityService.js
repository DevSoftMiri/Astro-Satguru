import ActivityLog from '../models/ActivityLog.js'

export const logActivity = async ({ actor, action, entityType, entityId, metadata }) => {
  return ActivityLog.create({ actor, action, entityType, entityId, metadata })
}
