import { normalizeEventType } from '../utils/eventTypeNormalizer.js'

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * Validates request body for POST /api/analytics/track.
 * Normalizes event types and rejects invalid payloads before persistence.
 */
export const validateTrackEvent = (req, res, next) => {
  const { eventType, metadata, sessionId } = req.body

  if (!eventType) {
    return res.status(400).json({
      success: false,
      message: 'eventType is required',
    })
  }

  const normalizedEventType = normalizeEventType(eventType)

  if (!normalizedEventType) {
    return res.status(400).json({
      success: false,
      message: 'Invalid event type',
    })
  }

  if (metadata !== undefined && !isPlainObject(metadata)) {
    return res.status(400).json({
      success: false,
      message: 'Metadata must be an object',
    })
  }

  if (
    sessionId !== undefined &&
    sessionId !== null &&
    sessionId !== '' &&
    typeof sessionId !== 'string'
  ) {
    return res.status(400).json({
      success: false,
      message: 'sessionId must be a string',
    })
  }

  req.body.eventType = normalizedEventType
  next()
}
