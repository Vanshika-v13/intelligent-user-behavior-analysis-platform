import { phase3Config } from '../config/phase3Config.js'
import { registerQueueDefinition } from '../queue/queueManager.js'
import { processRollupJob } from '../processors/rollupProcessor.js'
import { withWorkerLifecycle } from './baseWorker.js'

export const ROLLUP_WORKER_NAME = 'rollup-worker'

export const registerRollupWorker = () => {
  registerQueueDefinition({
    name: phase3Config.queue.rollupQueueName,
    dlqName: phase3Config.queue.rollupDlqName,
    workerName: ROLLUP_WORKER_NAME,
    processor: withWorkerLifecycle(ROLLUP_WORKER_NAME, processRollupJob),
    concurrency: phase3Config.queue.rollupConcurrency,
    enabled: phase3Config.jobs.enabled,
  })
}

export default registerRollupWorker
