import Event from '../models/Event.js'
import { normalizeEventType } from '../utils/eventTypeNormalizer.js'
import { validateUserExists, validateSessionExists } from '../utils/analyticsValidators.js'
import { createError } from '../utils/appError.js'

/**
 * Shared event persistence used by both /api/events and /api/analytics/track.
 * Keeps validation and storage consistent across ingestion paths.
 */
export const persistEvent = async ({
  sessionId,
  userId,
  eventType,
  page,
  metadata,
  timestamp,
}) => {
  const normalizedEventType = normalizeEventType(eventType)

  if (!normalizedEventType) {
    throw createError('Invalid event type', 400)
  }

  await validateUserExists(userId)

  if (sessionId) {
    await validateSessionExists(sessionId)
  }

  return Event.create({
    sessionId: sessionId || null,
    userId,
    eventType: normalizedEventType,
    page: page || '',
    metadata: metadata || {},
    timestamp: timestamp ? new Date(timestamp) : new Date(),
  })
}

/**
 * Persists an event from an authenticated /analytics/track request.
 * Session validation is optional because frontend may not yet wire session lifecycle.
 */
export const persistAuthenticatedTrackEvent = async (eventDocument) => {
  const { eventType, userId, sessionId } = eventDocument

  if (!eventType) {
    throw createError('Invalid event type', 400)
  }

  if (sessionId) {
    await validateSessionExists(sessionId)
  }

  return Event.create({
    ...eventDocument,
    sessionId: sessionId || null,
  })
}
