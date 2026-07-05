import { ingestBatchEvents } from '../services/batchEventService.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const createBatchEventsHandler = asyncHandler(async (req, res) => {
  const batchIdempotencyKey = req.get('Idempotency-Key') || null
  const events = req.body.events.map((event, index) => ({
    ...event,
    idempotencyKey:
      event.idempotencyKey ||
      (batchIdempotencyKey ? `${batchIdempotencyKey}:${index}` : null),
  }))

  const outcome = await ingestBatchEvents(events)

  res.status(outcome.summary.failed > 0 && outcome.summary.inserted === 0 ? 400 : 201).json({
    success: outcome.summary.failed === 0,
    message:
      outcome.summary.failed > 0
        ? 'Batch processed with partial failures'
        : 'Batch events ingested successfully',
    summary: outcome.summary,
    results: outcome.results,
    errors: outcome.errors,
  })
})

export default createBatchEventsHandler
