import { computeDailyRollup, computeEngagementSnapshots } from '../rollups/rollupService.js'

export const processDailyRollup = async (payload = {}) => {
  const targetDate = payload.targetDate ? new Date(payload.targetDate) : new Date()
  targetDate.setDate(targetDate.getDate() - (payload.daysAgo ?? 1))
  return computeDailyRollup(targetDate)
}

export const processEngagementSnapshot = async (payload = {}) => {
  const period = payload.period || 'daily'
  const referenceDate = payload.referenceDate ? new Date(payload.referenceDate) : new Date()
  return computeEngagementSnapshots(period, referenceDate)
}

export const processRollupJob = async (payload = {}) => {
  const jobType = payload.jobType || 'daily-rollup'

  if (jobType === 'engagement-snapshot') {
    return processEngagementSnapshot(payload)
  }

  return processDailyRollup(payload)
}

export default processRollupJob
