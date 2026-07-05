const createCounter = () => ({
  value: 0,
  increment(amount = 1) {
    this.value += amount
  },
})

const createWorkerMetrics = () => ({
  status: 'idle',
  currentJob: null,
  jobsStarted: createCounter(),
  jobsSucceeded: createCounter(),
  jobsFailed: createCounter(),
  retries: createCounter(),
  totalProcessingMs: 0,
  lastProcessingMs: null,
})

const state = {
  cacheHits: createCounter(),
  cacheMisses: createCounter(),
  queueSize: 0,
  queueStatsByName: {},
  dlqSize: 0,
  dlqSizeByName: {},
  queueFailures: createCounter(),
  workerStatus: 'idle',
  workerHealth: {},
  rollupFreshness: null,
  databaseLatencyMs: null,
  apiLatencies: [],
  aggregationTimings: [],
  slowQueries: [],
  cacheTimings: [],
  queueTimings: [],
}

const ensureWorkerMetrics = (workerName) => {
  if (!state.workerHealth[workerName]) {
    state.workerHealth[workerName] = createWorkerMetrics()
  }

  return state.workerHealth[workerName]
}

const trimSamples = (samples, max = 100) => {
  if (samples.length > max) {
    samples.splice(0, samples.length - max)
  }
}

export const metricsCollector = {
  recordCacheHit() {
    state.cacheHits.increment()
  },

  recordCacheMiss() {
    state.cacheMisses.increment()
  },

  setQueueSize(size, queueName = 'default') {
    state.queueSize = Math.max(0, size)

    if (!state.queueStatsByName[queueName]) {
      state.queueStatsByName[queueName] = {}
    }

    state.queueStatsByName[queueName].size = Math.max(0, size)
  },

  setQueueStats(queueName, counts) {
    state.queueStatsByName[queueName] = {
      ...(state.queueStatsByName[queueName] || {}),
      ...counts,
    }
  },

  incrementQueueSize(amount = 1) {
    state.queueSize = Math.max(0, state.queueSize + amount)
  },

  decrementQueueSize(amount = 1) {
    state.queueSize = Math.max(0, state.queueSize - amount)
  },

  setDlqSize(size, queueName = 'default') {
    state.dlqSize = Math.max(0, size)
    state.dlqSizeByName[queueName] = Math.max(0, size)
  },

  incrementDlqSize(amount = 1) {
    state.dlqSize = Math.max(0, state.dlqSize + amount)
  },

  recordQueueFailure() {
    state.queueFailures.increment()
  },

  setWorkerStatus(status) {
    state.workerStatus = status
  },

  setWorkerHealth(workerName, status, currentJob = null) {
    const worker = ensureWorkerMetrics(workerName)
    worker.status = status
    worker.currentJob = currentJob
    state.workerStatus = status
  },

  getWorkerHealth(workerName) {
    return state.workerHealth[workerName] || { status: 'unknown' }
  },

  recordWorkerJobStart(workerName) {
    ensureWorkerMetrics(workerName).jobsStarted.increment()
  },

  recordWorkerSuccess(workerName, durationMs) {
    const worker = ensureWorkerMetrics(workerName)
    worker.jobsSucceeded.increment()
    worker.totalProcessingMs += durationMs
    worker.lastProcessingMs = durationMs
  },

  recordWorkerFailure(workerName) {
    ensureWorkerMetrics(workerName).jobsFailed.increment()
  },

  recordWorkerRetry(workerName) {
    ensureWorkerMetrics(workerName).retries.increment()
  },

  setRollupFreshness(date) {
    state.rollupFreshness = date
  },

  recordDatabaseLatency(durationMs) {
    state.databaseLatencyMs = durationMs
  },

  recordApiLatency(durationMs, path, method) {
    trimSamples(state.apiLatencies)
    state.apiLatencies.push({
      durationMs,
      path,
      method,
      recordedAt: new Date().toISOString(),
    })
  },

  recordAggregationTiming(durationMs, label) {
    trimSamples(state.aggregationTimings)
    state.aggregationTimings.push({
      durationMs,
      label,
      recordedAt: new Date().toISOString(),
    })
  },

  recordSlowQuery(durationMs, label, details = {}) {
    trimSamples(state.slowQueries, 50)
    state.slowQueries.push({
      durationMs,
      label,
      details,
      recordedAt: new Date().toISOString(),
    })
  },

  recordCacheTiming(durationMs, operation) {
    trimSamples(state.cacheTimings)
    state.cacheTimings.push({
      durationMs,
      operation,
      recordedAt: new Date().toISOString(),
    })
  },

  recordQueueTiming(durationMs, operation) {
    trimSamples(state.queueTimings)
    state.queueTimings.push({
      durationMs,
      operation,
      recordedAt: new Date().toISOString(),
    })
  },

  getAverageProcessingTime(workerName) {
    const worker = state.workerHealth[workerName]

    if (!worker || worker.jobsSucceeded.value === 0) {
      return null
    }

    return Math.round(worker.totalProcessingMs / worker.jobsSucceeded.value)
  },

  getSnapshot() {
    const cacheHits = state.cacheHits.value
    const cacheMisses = state.cacheMisses.value
    const cacheTotal = cacheHits + cacheMisses

    const workers = Object.entries(state.workerHealth).reduce((acc, [name, worker]) => {
      acc[name] = {
        status: worker.status,
        currentJob: worker.currentJob,
        jobsStarted: worker.jobsStarted.value,
        jobsSucceeded: worker.jobsSucceeded.value,
        jobsFailed: worker.jobsFailed.value,
        retries: worker.retries.value,
        averageProcessingMs: this.getAverageProcessingTime(name),
        lastProcessingMs: worker.lastProcessingMs,
      }
      return acc
    }, {})

    const totalRetries = Object.values(state.workerHealth).reduce(
      (sum, worker) => sum + worker.retries.value,
      0
    )

    const totalSuccess = Object.values(state.workerHealth).reduce(
      (sum, worker) => sum + worker.jobsSucceeded.value,
      0
    )

    const totalFailures = Object.values(state.workerHealth).reduce(
      (sum, worker) => sum + worker.jobsFailed.value,
      0
    )

    return {
      cache: {
        hits: cacheHits,
        misses: cacheMisses,
        hitRatio: cacheTotal > 0 ? Number((cacheHits / cacheTotal).toFixed(4)) : 0,
      },
      queue: {
        size: state.queueSize,
        failures: state.queueFailures.value,
        dlqSize: state.dlqSize,
        byQueue: state.queueStatsByName,
        successCount: totalSuccess,
        failureCount: totalFailures,
        retryCount: totalRetries,
      },
      worker: {
        status: state.workerStatus,
        health: workers,
      },
      rollups: {
        lastUpdatedAt: state.rollupFreshness,
      },
      database: {
        latencyMs: state.databaseLatencyMs,
      },
      monitoring: {
        recentApiLatencies: state.apiLatencies.slice(-10),
        recentAggregationTimings: state.aggregationTimings.slice(-10),
        slowQueries: state.slowQueries.slice(-10),
        recentCacheTimings: state.cacheTimings.slice(-10),
        recentQueueTimings: state.queueTimings.slice(-10),
        prometheusReady: true,
      },
    }
  },

  resetForTests() {
    state.cacheHits.value = 0
    state.cacheMisses.value = 0
    state.queueSize = 0
    state.queueStatsByName = {}
    state.dlqSize = 0
    state.dlqSizeByName = {}
    state.queueFailures.value = 0
    state.workerStatus = 'idle'
    state.workerHealth = {}
    state.rollupFreshness = null
    state.databaseLatencyMs = null
    state.apiLatencies.length = 0
    state.aggregationTimings.length = 0
    state.slowQueries.length = 0
    state.cacheTimings.length = 0
    state.queueTimings.length = 0
  },
}

export default metricsCollector
