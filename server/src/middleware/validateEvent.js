import { normalizeEventType } from '../utils/eventTypeNormalizer.js'

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * Validates request body for POST /api/events.
 * Normalizes event types so legacy frontend aliases are accepted consistently.
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

  const normalizedEventType = normalizeEventType(eventType)

  if (!normalizedEventType) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event type',
    })
  }

  if (
    metadata !== undefined &&
    !isPlainObject(metadata)
  ) {
    return res.status(400).json({
      success: false,
      message: 'Metadata must be an object',
    })
  }

  req.body.eventType = normalizedEventType
  next()
}
