import { processEngagementSnapshot } from '../processors/rollupProcessor.js'

export const runHourlyEngagementSnapshotJob = async () =>
  processEngagementSnapshot({ period: 'daily' })

export default runHourlyEngagementSnapshotJob
