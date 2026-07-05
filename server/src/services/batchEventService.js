import { phase3Config } from '../config/phase3Config.js'
import { normalizeEventType } from '../utils/eventTypeNormalizer.js'
import { createError } from '../utils/appError.js'
import { persistBatchEvents } from '../workers/eventIngestionWorker.js'

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const validateBatchEvent = (event, index) => {
  const missingFields = []

  if (!event.userId) missingFields.push('userId')
  if (!event.eventType) missingFields.push('eventType')
  if (!event.page) missingFields.push('page')

  if (missingFields.length > 0) {
    throw createError(`Event at index ${index} missing fields: ${missingFields.join(', ')}`, 400)
  }

  const normalizedEventType = normalizeEventType(event.eventType)

  if (!normalizedEventType) {
    throw createError(`Event at index ${index} has invalid event type`, 400)
  }

  if (event.metadata !== undefined && !isPlainObject(event.metadata)) {
    throw createError(`Event at index ${index} metadata must be an object`, 400)
  }

  return {
    ...event,
    eventType: normalizedEventType,
  }
}

export const ingestBatchEvents = async (events) => {
  if (!Array.isArray(events)) {
    throw createError('Request body must contain an events array', 400)
  }

  if (events.length === 0) {
    throw createError('Events array cannot be empty', 400)
  }

  if (events.length > phase3Config.batch.maxSize) {
    throw createError(
      `Batch size exceeds limit of ${phase3Config.batch.maxSize}`,
      400
    )
  }

  const normalizedEvents = []
  const validationErrors = []

  events.forEach((event, index) => {
    try {
      normalizedEvents.push({
        index,
        event: validateBatchEvent(event, index),
      })
    } catch (error) {
      validationErrors.push({
        index,
        message: error.message,
        event,
      })
    }
  })

  if (validationErrors.length > 0 && normalizedEvents.length === 0) {
    return {
      summary: {
        total: events.length,
        inserted: 0,
        duplicates: 0,
        failed: validationErrors.length,
      },
      results: [],
      errors: validationErrors,
    }
  }

  const eventsToProcess = normalizedEvents.map(({ event }) => event)
  const useQueue = phase3Config.queue.enabled

  const batchOutcome = await persistBatchEvents(eventsToProcess, { useQueue })

  const results = batchOutcome.results.map((result, idx) => ({
    ...result,
    index: normalizedEvents[idx]?.index ?? result.index,
  }))

  const errors = [
    ...validationErrors,
    ...batchOutcome.errors.map((error) => ({
      ...error,
      index: normalizedEvents[error.index]?.index ?? error.index,
    })),
  ]

  return {
    summary: {
      total: events.length,
      inserted: batchOutcome.summary.inserted,
      duplicates: batchOutcome.summary.duplicates,
      failed: errors.length,
    },
    results,
    errors,
  }
}

export default ingestBatchEvents
