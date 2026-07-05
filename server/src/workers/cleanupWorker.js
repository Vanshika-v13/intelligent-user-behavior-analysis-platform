import { phase3Config } from '../config/phase3Config.js'
import { registerQueueDefinition } from '../queue/queueManager.js'
import { processCleanupJob } from '../processors/cleanupProcessor.js'
import { withWorkerLifecycle } from './baseWorker.js'

export const CLEANUP_WORKER_NAME = 'cleanup-worker'

export const registerCleanupWorker = () => {
  registerQueueDefinition({
    name: phase3Config.queue.cleanupQueueName,
    dlqName: phase3Config.queue.cleanupDlqName,
    workerName: CLEANUP_WORKER_NAME,
    processor: withWorkerLifecycle(CLEANUP_WORKER_NAME, processCleanupJob),
    concurrency: phase3Config.queue.cleanupConcurrency,
    enabled: phase3Config.jobs.enabled,
  })
}

export default registerCleanupWorker
