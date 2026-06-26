import { EVENT_TYPES } from '../constants/eventTypes.js'

/**
 * Validates request body for POST /api/events.
 */
export const validateEvent = (req, res, next) => {
  const { sessionId, userId, eventType, page, metadata } = req.body
  const missingFields = []

  if (!sessionId) missingFields.push('sessionId')
  if (!userId) missingFields.push('userId')
  if (!eventType) missingFields.push('eventType')
  if (!page) missingFields.push('page')

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    })
  }

  if (!EVENT_TYPES.includes(eventType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event type',
    })
  }

  if (
    metadata !== undefined &&
    (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata))
  ) {
    return res.status(400).json({
      success: false,
      message: 'Metadata must be an object',
    })
  }

  next()
}
