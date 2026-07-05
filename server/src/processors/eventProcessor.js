import Event from '../models/Event.js'
import { normalizeEventType } from '../utils/eventTypeNormalizer.js'
import { validateUserExists, validateSessionExists } from '../utils/analyticsValidators.js'
import { buildDedupFields, findExistingEvent } from '../utils/eventDeduplication.js'
import { createError } from '../utils/appError.js'
import { metricsCollector } from '../metrics/metricsCollector.js'

export const processSingleEvent = async (eventInput) => {
  const normalizedEventType = normalizeEventType(eventInput.eventType)

  if (!normalizedEventType) {
    throw createError('Invalid event type', 400)
  }

  await validateUserExists(eventInput.userId)

  if (eventInput.sessionId) {
    await validateSessionExists(eventInput.sessionId)
  }

  const dedupFields = buildDedupFields({
    ...eventInput,
    eventType: normalizedEventType,
  })

  const existing = await findExistingEvent(dedupFields)

  if (existing) {
    return {
      event: existing,
      duplicate: true,
    }
  }

  const startedAt = Date.now()

  try {
    const event = await Event.create({
      sessionId: eventInput.sessionId || null,
      userId: eventInput.userId,
      eventType: normalizedEventType,
      page: eventInput.page || '',
      metadata: eventInput.metadata || {},
      timestamp: eventInput.timestamp ? new Date(eventInput.timestamp) : new Date(),
      idempotencyKey: dedupFields.idempotencyKey,
      eventFingerprint: dedupFields.eventFingerprint,
    })

    metricsCollector.recordDatabaseLatency(Date.now() - startedAt)

    return {
      event,
      duplicate: false,
    }
  } catch (error) {
    if (error.code === 11000) {
      const duplicate = await findExistingEvent(dedupFields)

      if (duplicate) {
        return {
          event: duplicate,
          duplicate: true,
        }
      }
    }

    throw error
  }
}

export default processSingleEvent
