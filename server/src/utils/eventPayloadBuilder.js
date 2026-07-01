import { normalizeEventType } from './eventTypeNormalizer.js'

const TRACK_BODY_RESERVED = new Set([
  'eventType',
  'page',
  'metadata',
  'timestamp',
  'sessionId',
])

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * Merges top-level custom fields from /analytics/track into metadata.
 * Frontend spreads courseId, lessonId, etc. at the root of the payload.
 */
export const extractTrackMetadata = (body = {}) => {
  const { metadata } = body
  const extraFields = {}

  for (const [key, value] of Object.entries(body)) {
    if (!TRACK_BODY_RESERVED.has(key) && value !== undefined) {
      extraFields[key] = value
    }
  }

  const nestedMetadata = isPlainObject(metadata) ? metadata : {}

  return {
    ...extraFields,
    ...nestedMetadata,
  }
}

/**
 * Builds a persisted event document from an authenticated track request.
 */
export const buildTrackEventDocument = (body, userId) => {
  const normalizedEventType = normalizeEventType(body.eventType)
  const { page, timestamp, sessionId } = body

  return {
    eventType: normalizedEventType,
    page: typeof page === 'string' ? page.trim() : '',
    metadata: extractTrackMetadata(body),
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    userId,
    sessionId: sessionId || null,
  }
}
