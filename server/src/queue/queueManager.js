import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'
import {
  canUseBullMQ,
  createQueue,
  createWorker,
  createQueueEvents,
  getMemoryQueue,
} from './queueFactory.js'

const registry = {
  queues: new Map(),
  dlqs: new Map(),
  workers: new Map(),
  queueEvents: new Map(),
  definitions: new Map(),
  mode: 'memory',
}

const wrapProcessor = (workerName, processorFn) => async (job) => {
  const startedAt = Date.now()
  const jobName = job.name || 'unknown'

  metricsCollector.setWorkerHealth(workerName, 'running', jobName)
  metricsCollector.recordWorkerJobStart(workerName)

  try {
    const data = job.data ?? job
    const result = await processorFn(data, job)
    metricsCollector.recordWorkerSuccess(workerName, Date.now() - startedAt)
    metricsCollector.recordQueueTiming(Date.now() - startedAt, `${workerName}:success`)
    return result
  } catch (error) {
    metricsCollector.recordWorkerFailure(workerName)
    metricsCollector.recordQueueFailure()
    metricsCollector.recordQueueTiming(Date.now() - startedAt, `${workerName}:error`)

    if (job.attemptsMade !== undefined && job.opts?.attempts) {
      metricsCollector.recordWorkerRetry(workerName)
    }

    throw error
  } finally {
    metricsCollector.setWorkerHealth(workerName, 'idle')
  }
}

const attachDlqHandler = (worker, dlqQueue, workerName) => {
  if (!worker?.on) {
    return
  }

  worker.on('failed', async (job, error) => {
    if (!dlqQueue || !job) {
      return
    }

    const attempts = job.opts?.attempts ?? phase3Config.queue.maxRetries

    if (job.attemptsMade < attempts) {
      return
    }

    await dlqQueue.add('dead-letter', {
      originalJobId: job.id,
      originalJobName: job.name,
      workerName,
      data: job.data,
      error: error?.message || 'Unknown error',
      failedAt: new Date().toISOString(),
    })

    metricsCollector.incrementDlqSize()
  })
}

const attachMemoryWorker = (queueName, workerName, processorFn) => {
  const memoryQueue = getMemoryQueue(queueName)

  if (!memoryQueue) {
    return
  }

  memoryQueue.setWorkerHandler(wrapProcessor(workerName, processorFn))
}

export const registerQueueDefinition = ({
  name,
  dlqName = null,
  workerName,
  processor,
  concurrency,
  enabled = true,
}) => {
  registry.definitions.set(name, {
    name,
    dlqName,
    workerName,
    processor,
    concurrency: concurrency ?? phase3Config.queue.concurrency,
    enabled,
  })
}

export const initializeQueue = async (definition) => {
  const { name, dlqName, workerName, processor, concurrency } = definition

  const queue = await createQueue(name)
  registry.queues.set(name, queue)
  registry.mode = queue.mode || (canUseBullMQ() ? 'bullmq' : 'memory')

  let dlqQueue = null

  if (dlqName) {
    dlqQueue = await createQueue(dlqName)
    registry.dlqs.set(name, dlqQueue)
  }

  const wrappedProcessor = wrapProcessor(workerName, processor)
  const worker = await createWorker(name, wrappedProcessor, { concurrency })

  if (worker) {
    registry.workers.set(name, worker)
    attachDlqHandler(worker, dlqQueue, workerName)

    const events = await createQueueEvents(name)

    if (events) {
      registry.queueEvents.set(name, events)
    }
  } else {
    attachMemoryWorker(name, workerName, processor)
  }

  return queue
}

export const initializeRegisteredQueues = async () => {
  const initialized = []

  for (const definition of registry.definitions.values()) {
    if (!definition.enabled) {
      continue
    }

    await initializeQueue(definition)
    initialized.push(definition.name)
  }

  return {
    mode: registry.mode,
    queues: initialized,
  }
}

export const getManagedQueue = (name) => registry.queues.get(name)

export const getManagedDlq = (queueName) => registry.dlqs.get(queueName)

export const enqueueJob = async (queueName, jobName, data, options = {}) => {
  const queue = registry.queues.get(queueName)

  if (!queue) {
    throw new Error(`Queue not registered: ${queueName}`)
  }

  const startedAt = Date.now()
  metricsCollector.incrementQueueSize()

  try {
    const job = await queue.add(jobName, data, options)
    metricsCollector.recordQueueTiming(Date.now() - startedAt, 'enqueue')

    if (registry.mode === 'bullmq' && options.waitForResult !== false) {
      const events = registry.queueEvents.get(queueName)

      if (events && typeof job.waitUntilFinished === 'function') {
        const result = await job.waitUntilFinished(events, phase3Config.queue.jobTimeoutMs)
        metricsCollector.decrementQueueSize()
        return result
      }
    }

    if (registry.mode === 'memory') {
      metricsCollector.decrementQueueSize()
      return job
    }

    return job
  } catch (error) {
    metricsCollector.decrementQueueSize()
    metricsCollector.recordQueueFailure()
    throw error
  } finally {
    await refreshQueueMetrics(queueName)
  }
}

export const refreshQueueMetrics = async (queueName) => {
  const queue = registry.queues.get(queueName)

  if (!queue || typeof queue.getJobCounts !== 'function') {
    return null
  }

  const counts = await queue.getJobCounts()
  const waiting = (counts.waiting || 0) + (counts.active || 0) + (counts.delayed || 0)

  metricsCollector.setQueueSize(waiting, queueName)
  metricsCollector.setQueueStats(queueName, counts)

  const dlq = registry.dlqs.get(queueName)

  if (dlq && typeof dlq.getJobCounts === 'function') {
    const dlqCounts = await dlq.getJobCounts()
    metricsCollector.setDlqSize(dlqCounts.waiting || 0, queueName)
  }

  return counts
}

export const refreshAllQueueMetrics = async () => {
  const stats = {}

  for (const queueName of registry.queues.keys()) {
    stats[queueName] = await refreshQueueMetrics(queueName)
  }

  return stats
}

export const getQueueManagerSnapshot = () => ({
  mode: registry.mode,
  queues: [...registry.queues.keys()],
  workers: [...registry.workers.keys()].map((name) => ({
    queue: name,
    status: metricsCollector.getWorkerHealth(name),
  })),
  dlqs: [...registry.dlqs.keys()],
})

export const shutdownQueueManager = async (options = {}) => {
  const timeoutMs = options.timeoutMs ?? phase3Config.queue.shutdownTimeoutMs

  const shutdownPromise = (async () => {
    for (const worker of registry.workers.values()) {
      if (worker?.close) {
        await worker.close()
      }
    }

    for (const events of registry.queueEvents.values()) {
      if (events?.close) {
        await events.close()
      }
    }

    for (const queue of registry.queues.values()) {
      if (queue?.close) {
        await queue.close()
      }
    }

    for (const dlq of registry.dlqs.values()) {
      if (dlq?.close) {
        await dlq.close()
      }
    }

    registry.workers.clear()
    registry.queueEvents.clear()
    registry.queues.clear()
    registry.dlqs.clear()
  })()

  await Promise.race([
    shutdownPromise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Queue shutdown timed out')), timeoutMs)
    }),
  ]).catch((error) => {
    console.warn(`Queue manager shutdown warning: ${error.message}`)
  })
}

export const queueManager = {
  registerQueueDefinition,
  initializeRegisteredQueues,
  getManagedQueue,
  getManagedDlq,
  enqueueJob,
  refreshQueueMetrics,
  refreshAllQueueMetrics,
  getQueueManagerSnapshot,
  shutdownQueueManager,
}

export default queueManager
