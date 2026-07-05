const toInt = (value, fallback) => {
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toBool = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  return ['true', '1', 'yes'].includes(String(value).toLowerCase())
}

export const phase3Config = {
  redis: {
    url: process.env.REDIS_URL || '',
    enabled: toBool(process.env.REDIS_ENABLED, process.env.NODE_ENV !== 'test'),
  },
  cache: {
    enabled: toBool(process.env.CACHE_ENABLED, process.env.NODE_ENV !== 'test'),
    ttlSeconds: toInt(process.env.CACHE_TTL_SECONDS, 300),
    prefix: process.env.CACHE_PREFIX || 'iubp:analytics',
  },
  queue: {
    enabled: toBool(process.env.EVENT_QUEUE_ENABLED, false),
    name: process.env.EVENT_QUEUE_NAME || 'event-ingestion',
    dlqName: process.env.EVENT_DLQ_NAME || 'event-ingestion-dlq',
    platformJobsName: process.env.PLATFORM_JOBS_QUEUE_NAME || 'platform-jobs',
    analyticsQueueName: process.env.ANALYTICS_QUEUE_NAME || 'analytics-jobs',
    analyticsDlqName: process.env.ANALYTICS_DLQ_NAME || 'analytics-jobs-dlq',
    rollupQueueName: process.env.ROLLUP_QUEUE_NAME || 'rollup-jobs',
    rollupDlqName: process.env.ROLLUP_DLQ_NAME || 'rollup-jobs-dlq',
    reportQueueName: process.env.REPORT_QUEUE_NAME || 'report-jobs',
    reportDlqName: process.env.REPORT_DLQ_NAME || 'report-jobs-dlq',
    cleanupQueueName: process.env.CLEANUP_QUEUE_NAME || 'cleanup-jobs',
    cleanupDlqName: process.env.CLEANUP_DLQ_NAME || 'cleanup-jobs-dlq',
    maxRetries: toInt(process.env.EVENT_QUEUE_MAX_RETRIES, 3),
    concurrency: toInt(process.env.EVENT_QUEUE_CONCURRENCY, 5),
    analyticsConcurrency: toInt(process.env.ANALYTICS_QUEUE_CONCURRENCY, 2),
    rollupConcurrency: toInt(process.env.ROLLUP_QUEUE_CONCURRENCY, 1),
    reportConcurrency: toInt(process.env.REPORT_QUEUE_CONCURRENCY, 1),
    cleanupConcurrency: toInt(process.env.CLEANUP_QUEUE_CONCURRENCY, 1),
    analyticsEnabled: toBool(process.env.ANALYTICS_QUEUE_ENABLED, false),
    backoffDelayMs: toInt(process.env.QUEUE_BACKOFF_DELAY_MS, 1000),
    backoffType: process.env.QUEUE_BACKOFF_TYPE || 'exponential',
    rateLimitMax: toInt(process.env.QUEUE_RATE_LIMIT_MAX, 0),
    rateLimitDurationMs: toInt(process.env.QUEUE_RATE_LIMIT_DURATION_MS, 1000),
    jobTimeoutMs: toInt(process.env.QUEUE_JOB_TIMEOUT_MS, 30000),
    shutdownTimeoutMs: toInt(process.env.QUEUE_SHUTDOWN_TIMEOUT_MS, 10000),
  },
  batch: {
    maxSize: toInt(process.env.EVENT_BATCH_MAX_SIZE, 100),
  },
  rollups: {
    retentionDays: toInt(process.env.EVENT_RETENTION_DAYS, 365),
  },
  jobs: {
    enabled: toBool(process.env.JOBS_ENABLED, process.env.NODE_ENV !== 'test'),
    nightlyRollupCron: process.env.NIGHTLY_ROLLUP_CRON || '0 2 * * *',
    hourlyEngagementCron: process.env.HOURLY_ENGAGEMENT_CRON || '0 * * * *',
    cacheCleanupCron: process.env.CACHE_CLEANUP_CRON || '30 * * * *',
    eventCleanupCron: process.env.EVENT_CLEANUP_CRON || '0 3 * * 0',
    weeklyReportPrepCron: process.env.WEEKLY_REPORT_PREP_CRON || '0 4 * * 1',
    monthlyCleanupCron: process.env.MONTHLY_CLEANUP_CRON || '0 3 1 * *',
  },
  monitoring: {
    slowQueryThresholdMs: toInt(process.env.SLOW_QUERY_THRESHOLD_MS, 500),
    slowApiThresholdMs: toInt(process.env.SLOW_API_THRESHOLD_MS, 1000),
  },
}

export default phase3Config
