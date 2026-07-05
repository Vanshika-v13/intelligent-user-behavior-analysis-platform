import { phase3Config } from '../config/phase3Config.js'
import { metricsCollector } from '../metrics/metricsCollector.js'
import {
  enqueueJob,
  getManagedQueue,
  getManagedDlq,
  refreshQueueMetrics,
  initializeRegisteredQueues,
  shutdownQueueManager,
  getQueueManagerSnapshot,
} from './queueManager.js'
import { registerAllWorkers } from '../workers/index.js'

let initialized = false

export const initializeEventQueue = async () => {
  if (initialized) {
    return getManagedQueue(phase3Config.queue.name)
  }

  registerAllWorkers()
  await initializeRegisteredQueues()
  initialized = true

  return getManagedQueue(phase3Config.queue.name)
}

export const getEventQueue = async () => {
  if (!initialized) {
    await initializeEventQueue()
  }

  return getManagedQueue(phase3Config.queue.name)
}

export const getDeadLetterQueue = async () => {
  if (!initialized) {
    await initializeEventQueue()
  }

  return getManagedDlq(phase3Config.queue.name)
}

export const enqueueEvent = async (eventPayload) => {
  if (!initialized) {
    await initializeEventQueue()
  }

  return enqueueJob(phase3Config.queue.name, 'ingest-event', eventPayload)
}

export const enqueueBatchEvents = async (events) => {
  if (!initialized) {
    await initializeEventQueue()
  }

  return enqueueJob(phase3Config.queue.name, 'ingest-batch', { events })
}

export const getQueueMetrics = async () => {
  if (!initialized) {
    await initializeEventQueue()
  }

  return refreshQueueMetrics(phase3Config.queue.name)
}

export const getQueueSnapshot = () => getQueueManagerSnapshot()

export const shutdownEventQueue = async (options = {}) => {
  await shutdownQueueManager(options)
  initialized = false
}

export default enqueueEvent
