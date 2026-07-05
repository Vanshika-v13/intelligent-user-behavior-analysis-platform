import { processSingleEvent } from './eventProcessor.js'

export const processBatchEvents = async (payload) => {
  const events = payload?.events || payload

  if (!Array.isArray(events)) {
    throw new Error('Batch payload must contain an events array')
  }

  const results = []
  const errors = []
  let inserted = 0
  let duplicates = 0

  for (let index = 0; index < events.length; index += 1) {
    const eventInput = events[index]

    try {
      const outcome = await processSingleEvent(eventInput)

      if (outcome.duplicate) {
        duplicates += 1
      } else {
        inserted += 1
      }

      results.push({
        index,
        success: true,
        duplicate: outcome.duplicate,
        eventId: outcome.event._id?.toString?.() || String(outcome.event._id),
      })
    } catch (error) {
      errors.push({
        index,
        message: error.message || 'Failed to ingest event',
        event: eventInput,
      })
    }
  }

  return {
    summary: {
      total: events.length,
      inserted,
      duplicates,
      failed: errors.length,
    },
    results,
    errors,
  }
}

export default processBatchEvents
