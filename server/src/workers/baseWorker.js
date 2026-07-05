import { metricsCollector } from '../metrics/metricsCollector.js'

export const createWorkerLogger = (workerName) => ({
  info(message, meta = {}) {
    console.log(`[worker:${workerName}] ${message}`, Object.keys(meta).length ? meta : '')
  },
  error(message, error, meta = {}) {
    console.error(`[worker:${workerName}] ${message}`, {
      error: error?.message || error,
      ...meta,
    })
  },
})

export const withWorkerLifecycle = (workerName, processorFn) => {
  const logger = createWorkerLogger(workerName)

  return async (data, job) => {
    logger.info('job started', { jobName: job?.name })

    try {
      const result = await processorFn(data, job)
      logger.info('job completed', { jobName: job?.name })
      return result
    } catch (error) {
      logger.error('job failed', error, { jobName: job?.name })
      throw error
    }
  }
}

export const recordWorkerShutdown = (workerName) => {
  metricsCollector.setWorkerHealth(workerName, 'stopped')
}

export default {
  createWorkerLogger,
  withWorkerLifecycle,
  recordWorkerShutdown,
}
