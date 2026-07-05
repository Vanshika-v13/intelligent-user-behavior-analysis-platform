import { phase3Config } from '../config/phase3Config.js'
import { registerQueueDefinition } from '../queue/queueManager.js'
import { processMlJob } from '../processors/mlProcessor.js'
import { withWorkerLifecycle } from './baseWorker.js'

export const ANALYTICS_WORKER_NAME = 'analytics-worker'

export const registerAnalyticsWorker = () => {
  registerQueueDefinition({
    name: phase3Config.queue.analyticsQueueName,
    dlqName: phase3Config.queue.analyticsDlqName,
    workerName: ANALYTICS_WORKER_NAME,
    processor: withWorkerLifecycle(ANALYTICS_WORKER_NAME, processMlJob),
    concurrency: phase3Config.queue.analyticsConcurrency,
    enabled: phase3Config.queue.analyticsEnabled,
  })
}

export default registerAnalyticsWorker
