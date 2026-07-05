import { processSingleEvent } from '../processors/eventProcessor.js'
import { processBatchEvents } from '../processors/batchEventProcessor.js'
import { createError } from '../utils/appError.js'

export const processEventIngestionJob = async (eventInput) => processSingleEvent(eventInput)

export const persistEventWithDedup = async (eventInput, { useQueue = false } = {}) => {
  if (useQueue) {
    const { enqueueEvent } = await import('../queue/eventQueue.js')
    const jobResult = await enqueueEvent(eventInput)

    if (jobResult && typeof jobResult.then === 'function') {
      return jobResult
    }

    if (jobResult?.event) {
      return jobResult
    }
  }

  return processSingleEvent(eventInput)
}

export const persistBatchEvents = async (events, { useQueue = false } = {}) => {
  if (useQueue) {
    const { enqueueBatchEvents } = await import('../queue/eventQueue.js')
    return enqueueBatchEvents(events)
  }

  return processBatchEvents({ events })
}

export default persistEventWithDedup
