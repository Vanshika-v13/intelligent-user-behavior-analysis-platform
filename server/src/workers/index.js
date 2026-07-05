import { registerEventWorker } from './eventWorker.js'
import { registerAnalyticsWorker } from './analyticsWorker.js'
import { registerRollupWorker } from './rollupWorker.js'
import { registerReportWorker } from './reportWorker.js'
import { registerCleanupWorker } from './cleanupWorker.js'

export const registerAllWorkers = () => {
  registerEventWorker()
  registerAnalyticsWorker()
  registerRollupWorker()
  registerReportWorker()
  registerCleanupWorker()
}

export { registerEventWorker } from './eventWorker.js'
export { registerAnalyticsWorker } from './analyticsWorker.js'
export { registerRollupWorker } from './rollupWorker.js'
export { registerReportWorker } from './reportWorker.js'
export { registerCleanupWorker } from './cleanupWorker.js'
export { EVENT_WORKER_NAME } from './eventWorker.js'
export { ANALYTICS_WORKER_NAME } from './analyticsWorker.js'
export { ROLLUP_WORKER_NAME } from './rollupWorker.js'
export { REPORT_WORKER_NAME } from './reportWorker.js'
export { CLEANUP_WORKER_NAME } from './cleanupWorker.js'

export default registerAllWorkers
