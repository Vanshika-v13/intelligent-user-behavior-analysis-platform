import { phase3Config } from '../config/phase3Config.js'
import { registerQueueDefinition } from '../queue/queueManager.js'
import { processReportJob } from '../processors/reportProcessor.js'
import { withWorkerLifecycle } from './baseWorker.js'

export const REPORT_WORKER_NAME = 'report-worker'

export const registerReportWorker = () => {
  registerQueueDefinition({
    name: phase3Config.queue.reportQueueName,
    dlqName: phase3Config.queue.reportDlqName,
    workerName: REPORT_WORKER_NAME,
    processor: withWorkerLifecycle(REPORT_WORKER_NAME, processReportJob),
    concurrency: phase3Config.queue.reportConcurrency,
    enabled: phase3Config.jobs.enabled,
  })
}

export default registerReportWorker
