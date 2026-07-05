import { phase3Config } from '../config/phase3Config.js'
import { registerQueueDefinition } from '../queue/queueManager.js'
import { processSingleEvent } from '../processors/eventProcessor.js'
import { processBatchEvents } from '../processors/batchEventProcessor.js'
import { withWorkerLifecycle } from './baseWorker.js'

export const EVENT_WORKER_NAME = 'event-worker'

export const eventJobProcessor = async (data, job) => {
  const jobName = job?.name || 'ingest-event'

  if (jobName === 'ingest-batch') {
    return processBatchEvents(data)
  }

  return processSingleEvent(data)
}

export const registerEventWorker = () => {
  registerQueueDefinition({
    name: phase3Config.queue.name,
    dlqName: phase3Config.queue.dlqName,
    workerName: EVENT_WORKER_NAME,
    processor: withWorkerLifecycle(EVENT_WORKER_NAME, eventJobProcessor),
    concurrency: phase3Config.queue.concurrency,
    enabled: true,
  })
}

export default registerEventWorker
