import { runNightlyRollupJob } from './nightlyRollupJob.js'
import { runHourlyEngagementSnapshotJob } from './hourlyEngagementSnapshotJob.js'
import { runExpiredCacheCleanupJob } from './expiredCacheCleanupJob.js'
import { runOldEventCleanupJob } from './oldEventCleanupJob.js'
import { runWeeklyReportPrepJob } from './weeklyReportPrepJob.js'
import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'
import { enqueueJob, getManagedQueue } from '../queue/queueManager.js'

const scheduledJobs = []
let jobsQueue = null
let jobsWorker = null
let jobsQueueEvents = null
let _jobsInitialized = false

const cronToIntervalMs = (cronExpression) => {
  if (cronExpression.startsWith('0 * * * *')) {
    return 60 * 60 * 1000
  }

  if (cronExpression.startsWith('30 * * * *')) {
    return 60 * 60 * 1000
  }

  if (cronExpression.startsWith('0 2 * * *')) {
    return 24 * 60 * 60 * 1000
  }

  if (cronExpression.startsWith('0 3 * * 0')) {
    return 7 * 24 * 60 * 60 * 1000
  }

  if (cronExpression.startsWith('0 4 * * 1')) {
    return 7 * 24 * 60 * 60 * 1000
  }

  if (cronExpression.startsWith('0 3 1 * *')) {
    return 30 * 24 * 60 * 60 * 1000
  }

  return 24 * 60 * 60 * 1000
}

const registerIntervalJob = (name, cronExpression, handler) => {
  if (!phase3Config.jobs.enabled) {
    return null
  }

  const intervalMs = cronToIntervalMs(cronExpression)
  const MAX_TIMEOUT = 2147483647

  const jobState = { name, timer: null, active: true }

  const scheduleNext = (delay) => {
    if (!jobState.active) return

    if (delay > MAX_TIMEOUT) {
      jobState.timer = setTimeout(() => {
        scheduleNext(delay - MAX_TIMEOUT)
      }, MAX_TIMEOUT)
    } else {
      jobState.timer = setTimeout(async () => {
        if (!jobState.active) return
        try {
          await handler()
        } catch (error) {
          console.error(`Job ${name} failed:`, error.message)
          metricsCollector.recordWorkerFailure('scheduler')
        }
        if (jobState.active) {
          scheduleNext(intervalMs)
        }
      }, delay)
    }
  }

  scheduleNext(intervalMs)

  scheduledJobs.push(jobState)
  return jobState
}

export const runMonthlyCleanupJob = async () => runOldEventCleanupJob()

export const jobHandlers = {
  'nightly-rollup': runNightlyRollupJob,
  'hourly-engagement-snapshot': runHourlyEngagementSnapshotJob,
  'expired-cache-cleanup': runExpiredCacheCleanupJob,
  'old-event-cleanup': runOldEventCleanupJob,
  'weekly-report-prep': runWeeklyReportPrepJob,
  'monthly-cleanup': runMonthlyCleanupJob,
}

const dispatchScheduledJob = async (jobName) => {
  const handler = jobHandlers[jobName]

  if (!handler) {
    throw new Error(`Unknown job: ${jobName}`)
  }

  metricsCollector.recordWorkerJobStart('scheduler')
  const startedAt = Date.now()

  try {
    const result = await handler()
    metricsCollector.recordWorkerSuccess('scheduler', Date.now() - startedAt)
    return result
  } catch (error) {
    metricsCollector.recordWorkerFailure('scheduler')
    throw error
  }
}

export const runJobByName = async (name) => dispatchScheduledJob(name)

const enqueueMaintenanceJob = async (queueName, jobName, payload) => {
  const queue = getManagedQueue(queueName)

  if (queue) {
    return enqueueJob(queueName, jobName, payload, { waitForResult: false })
  }

  return dispatchScheduledJob(jobName)
}

const scheduleDefinitions = [
  {
    name: 'nightly-rollup',
    cron: phase3Config.jobs.nightlyRollupCron,
    queueName: phase3Config.queue.rollupQueueName,
    payload: { jobType: 'daily-rollup' },
  },
  {
    name: 'hourly-engagement-snapshot',
    cron: phase3Config.jobs.hourlyEngagementCron,
    queueName: phase3Config.queue.rollupQueueName,
    payload: { jobType: 'engagement-snapshot', period: 'daily' },
  },
  {
    name: 'expired-cache-cleanup',
    cron: phase3Config.jobs.cacheCleanupCron,
    queueName: phase3Config.queue.cleanupQueueName,
    payload: { jobType: 'cache-cleanup' },
  },
  {
    name: 'old-event-cleanup',
    cron: phase3Config.jobs.eventCleanupCron,
    queueName: phase3Config.queue.cleanupQueueName,
    payload: { jobType: 'event-cleanup' },
  },
  {
    name: 'weekly-report-prep',
    cron: phase3Config.jobs.weeklyReportPrepCron,
    queueName: phase3Config.queue.reportQueueName,
    payload: { reportType: 'weekly-summary' },
  },
  {
    name: 'monthly-cleanup',
    cron: phase3Config.jobs.monthlyCleanupCron,
    queueName: phase3Config.queue.cleanupQueueName,
    payload: { jobType: 'event-cleanup' },
  },
]

export const initializeJobs = async () => {
  if (_jobsInitialized) {
    return { mode: 'already-initialized' }
  }

  if (!phase3Config.jobs.enabled) {
    return { mode: 'disabled' }
  }

  if (phase3Config.redis.enabled && phase3Config.redis.url) {
    try {
      const { Queue, Worker, QueueEvents } = await import('bullmq')
      const { queueConfig } = await import('../queue/queueConfig.js')

      jobsQueue = new Queue(phase3Config.queue.platformJobsName, {
        connection: queueConfig.connection,
        defaultJobOptions: queueConfig.defaultJobOptions,
      })

      jobsWorker = new Worker(
        phase3Config.queue.platformJobsName,
        async (job) => dispatchScheduledJob(job.name),
        { connection: queueConfig.connection }
      )

      jobsQueueEvents = new QueueEvents(phase3Config.queue.platformJobsName, {
        connection: queueConfig.connection,
      })

      for (const definition of scheduleDefinitions) {
        await jobsQueue.add(
          definition.name,
          definition.payload,
          { repeat: { pattern: definition.cron } }
        )
      }

      _jobsInitialized = true
      return { mode: 'bullmq' }
    } catch (error) {
      console.warn(`BullMQ jobs unavailable, using interval scheduler: ${error.message}`)
    }
  }

  for (const definition of scheduleDefinitions) {
    registerIntervalJob(definition.name, definition.cron, () =>
      enqueueMaintenanceJob(definition.queueName, definition.name, definition.payload)
    )
  }

  _jobsInitialized = true
  return { mode: 'interval' }
}

export const shutdownJobs = async () => {
  for (const job of scheduledJobs) {
    job.active = false
    clearTimeout(job.timer)
  }

  scheduledJobs.length = 0

  if (jobsWorker) {
    await jobsWorker.close()
    jobsWorker = null
  }

  if (jobsQueueEvents) {
    await jobsQueueEvents.close()
    jobsQueueEvents = null
  }

  if (jobsQueue) {
    await jobsQueue.close()
    jobsQueue = null
  }

  _jobsInitialized = false
}

export default {
  initializeJobs,
  shutdownJobs,
  runJobByName,
}
