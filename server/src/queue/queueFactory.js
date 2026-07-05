import { phase3Config } from '../config/phase3Config.js'
import { queueConfig } from './queueConfig.js'

const memoryQueues = new Map()

const createMemoryQueue = (name) => {
  if (memoryQueues.has(name)) {
    return memoryQueues.get(name)
  }

  const jobs = []
  let workerHandler = null
  let workerRunning = false

  const runWorker = async () => {
    if (workerRunning || !workerHandler) {
      return
    }

    workerRunning = true

    while (jobs.length > 0) {
      const job = jobs.shift()

      try {
        const result = await workerHandler(job)
        job.resolve(result)
      } catch (error) {
        job.reject(error)
      }
    }

    workerRunning = false
  }

  const queue = {
    name,
    mode: 'memory',

    setWorkerHandler(handler) {
      workerHandler = handler
    },

    async add(jobName, data, options = {}) {
      return new Promise((resolve, reject) => {
        jobs.push({
          id: `${name}-${Date.now()}-${jobs.length}`,
          name: jobName,
          data,
          opts: options,
          resolve,
          reject,
        })

        runWorker().catch(reject)
      })
    },

    async getJobCounts() {
      return {
        waiting: jobs.length,
        active: workerRunning ? 1 : 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      }
    },

    async close() {
      jobs.length = 0
      workerHandler = null
    },
  }

  memoryQueues.set(name, queue)
  return queue
}

const createBullQueue = async (name, options = {}) => {
  const { Queue } = await import('bullmq')

  return new Queue(name, {
    connection: queueConfig.connection,
    defaultJobOptions: {
      ...queueConfig.defaultJobOptions,
      ...options.defaultJobOptions,
    },
  })
}

const createBullWorker = async (queueName, processor, options = {}) => {
  const { Worker } = await import('bullmq')

  return new Worker(queueName, processor, {
    connection: queueConfig.connection,
    concurrency: options.concurrency || phase3Config.queue.concurrency,
    limiter: queueConfig.limiter,
    lockDuration: queueConfig.lockDuration,
  })
}

const createBullQueueEvents = async (queueName) => {
  const { QueueEvents } = await import('bullmq')

  return new QueueEvents(queueName, {
    connection: queueConfig.connection,
  })
}

export const canUseBullMQ = () =>
  phase3Config.redis.enabled &&
  phase3Config.redis.url &&
  queueConfig.connection !== null

export const createQueue = async (name, options = {}) => {
  if (canUseBullMQ()) {
    try {
      const queue = await createBullQueue(name, options)
      queue.mode = 'bullmq'
      return queue
    } catch (error) {
      console.warn(`BullMQ queue "${name}" unavailable, using memory fallback: ${error.message}`)
    }
  }

  return createMemoryQueue(name)
}

export const createWorker = async (queueName, processor, options = {}) => {
  if (canUseBullMQ()) {
    try {
      return await createBullWorker(queueName, processor, options)
    } catch (error) {
      console.warn(`BullMQ worker for "${queueName}" unavailable: ${error.message}`)
    }
  }

  return null
}

export const createQueueEvents = async (queueName) => {
  if (!canUseBullMQ()) {
    return null
  }

  try {
    return await createBullQueueEvents(queueName)
  } catch (error) {
    console.warn(`QueueEvents for "${queueName}" unavailable: ${error.message}`)
    return null
  }
}

export const getMemoryQueue = (name) => memoryQueues.get(name)

export default {
  canUseBullMQ,
  createQueue,
  createWorker,
  createQueueEvents,
  getMemoryQueue,
}
