import {
  request,
  app,
  createTestUser,
  startTestSession,
  trackTestEvent,
} from './helpers.js'
import { PAGE_VIEW, CLICK } from '../src/constants/eventTypes.js'
import { cacheService } from '../src/cache/cacheService.js'
import { buildAnalyticsCacheKey } from '../src/cache/cacheKeys.js'
import { metricsCollector } from '../src/metrics/metricsCollector.js'
import { phase3Config } from '../src/config/phase3Config.js'
import { computeDailyRollup } from '../src/rollups/rollupService.js'
import AnalyticsDailyRollup from '../src/rollups/models/AnalyticsDailyRollup.js'
import { enqueueEvent, initializeEventQueue } from '../src/queue/eventQueue.js'
import { buildEventFingerprint } from '../src/utils/eventFingerprint.js'
import Event from '../src/models/Event.js'
import { runJobByName, jobHandlers } from '../src/jobs/jobManager.js'
import { processBatchEvents } from '../src/processors/batchEventProcessor.js'
import { processReportJob } from '../src/processors/reportProcessor.js'
import { processMlJob } from '../src/processors/mlProcessor.js'
import { getQueueManagerSnapshot } from '../src/queue/queueManager.js'

describe('Phase 3 Platform Infrastructure', () => {
  let user
  let session

  beforeEach(async () => {
    metricsCollector.resetForTests()
    user = await createTestUser()
    session = await startTestSession(request(app), user._id)
  })

  describe('Redis caching layer', () => {
    it('stores and retrieves analytics cache entries with filter-aware keys', async () => {
      const filters = { startDate: '2026-01-01', endDate: '2026-01-31' }
      const cacheKey = buildAnalyticsCacheKey('overview', filters)
      const payload = { totalEvents: 42 }

      await cacheService.set(cacheKey, payload, 60)
      const cached = await cacheService.get(cacheKey)

      expect(cached).toEqual(payload)
    })

    it('uses different keys for different query filters', async () => {
      const keyA = buildAnalyticsCacheKey('devices', { device: 'mobile' })
      const keyB = buildAnalyticsCacheKey('devices', { device: 'desktop' })

      expect(keyA).not.toBe(keyB)
    })
  })

  describe('Analytics rollups', () => {
    it('creates daily rollup summaries without removing raw events', async () => {
      await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: PAGE_VIEW,
        page: '/dashboard',
      })
      await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: CLICK,
        page: '/dashboard',
      })

      const rawEventsBefore = await Event.countDocuments()
      const rollup = await computeDailyRollup(new Date())
      const rawEventsAfter = await Event.countDocuments()

      expect(rawEventsAfter).toBe(rawEventsBefore)
      expect(rollup.dailyEvents).toBeGreaterThanOrEqual(2)
      expect(rollup.dailyPageViews).toBeGreaterThanOrEqual(1)
      expect(await AnalyticsDailyRollup.countDocuments()).toBe(1)
    })

    it('runs nightly rollup job handler', async () => {
      await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: PAGE_VIEW,
        page: '/courses',
      })

      const rollup = await runJobByName('nightly-rollup')

      expect(rollup.dateKey).toBeTruthy()
      expect(rollup.dailyEvents).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Event deduplication', () => {
    it('returns the same event for duplicate idempotency keys', async () => {
      const payload = {
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        eventType: PAGE_VIEW,
        page: '/dedupe',
        idempotencyKey: 'dedupe-key-1',
      }

      const first = await request(app).post('/api/events').send(payload)
      const second = await request(app).post('/api/events').send(payload)

      expect(first.status).toBe(201)
      expect(second.status).toBe(201)
      expect(second.body.event._id).toBe(first.body.event._id)
      expect(await Event.countDocuments({ idempotencyKey: 'dedupe-key-1' })).toBe(1)
    })

    it('builds stable event fingerprints', () => {
      const input = {
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        eventType: PAGE_VIEW,
        page: '/stable',
        metadata: { source: 'test' },
        timestamp: '2026-01-01T00:00:00.000Z',
      }

      const first = buildEventFingerprint(input)
      const second = buildEventFingerprint(input)

      expect(first).toBe(second)
    })
  })

  describe('Event queue', () => {
    it('processes queued events through the ingestion worker', async () => {
      await initializeEventQueue()

      const outcome = await enqueueEvent({
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        eventType: PAGE_VIEW,
        page: '/queued',
      })

      expect(outcome.event).toBeTruthy()
      expect(outcome.duplicate).toBe(false)
      expect(await Event.countDocuments({ page: '/queued' })).toBe(1)
    })
  })

  describe('POST /api/v2/events/batch', () => {
    it('ingests valid batch events with partial failure reporting', async () => {
      const response = await request(app)
        .post('/api/v2/events/batch')
        .send({
          events: [
            {
              sessionId: session._id.toString(),
              userId: user._id.toString(),
              eventType: PAGE_VIEW,
              page: '/batch-1',
            },
            {
              sessionId: session._id.toString(),
              userId: user._id.toString(),
              eventType: 'INVALID',
              page: '/batch-2',
            },
          ],
        })

      expect(response.status).toBe(201)
      expect(response.body.summary.total).toBe(2)
      expect(response.body.summary.failed).toBeGreaterThanOrEqual(1)
      expect(response.body.summary.inserted).toBeGreaterThanOrEqual(1)
      expect(response.body.errors.length).toBeGreaterThan(0)
    })

    it('supports idempotent batch ingestion', async () => {
      const payload = {
        events: [
          {
            sessionId: session._id.toString(),
            userId: user._id.toString(),
            eventType: PAGE_VIEW,
            page: '/batch-idempotent',
            idempotencyKey: 'batch-item-1',
          },
        ],
      }

      const first = await request(app).post('/api/v2/events/batch').send(payload)
      const second = await request(app).post('/api/v2/events/batch').send(payload)

      expect(first.status).toBe(201)
      expect(second.status).toBe(201)
      expect(second.body.summary.duplicates).toBeGreaterThanOrEqual(1)
      expect(await Event.countDocuments({ page: '/batch-idempotent' })).toBe(1)
    })

    it('rejects batches above configured size limit', async () => {
      const events = Array.from({ length: phase3Config.batch.maxSize + 1 }, (_, index) => ({
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        eventType: PAGE_VIEW,
        page: `/batch-limit-${index}`,
      }))

      const response = await request(app).post('/api/v2/events/batch').send({ events })

      expect(response.status).toBe(400)
      expect(response.body.message).toContain('Batch size exceeds limit')
    })
  })

  describe('GET /api/v2/system/metrics', () => {
    it('returns operational metrics snapshot', async () => {
      const response = await request(app).get('/api/v2/system/metrics')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.cache).toHaveProperty('hitRatio')
      expect(response.body.data.queue).toHaveProperty('size')
      expect(response.body.data.queue).toHaveProperty('dlqSize')
      expect(response.body.data.queue).toHaveProperty('successCount')
      expect(response.body.data.worker).toHaveProperty('status')
      expect(response.body.data.worker).toHaveProperty('health')
      expect(response.body.data.rollups).toHaveProperty('lastUpdatedAt')
      expect(response.body.data.database).toHaveProperty('latencyMs')
      expect(response.body.data.monitoring).toHaveProperty('prometheusReady')
    })
  })

  describe('Queue architecture', () => {
    it('registers queue manager with event ingestion queue', async () => {
      await initializeEventQueue()
      const snapshot = getQueueManagerSnapshot()

      expect(snapshot.queues).toContain(phase3Config.queue.name)
      expect(snapshot.mode).toBe('memory')
    })

    it('processes batch events through the batch processor', async () => {
      const outcome = await processBatchEvents({
        events: [
          {
            sessionId: session._id.toString(),
            userId: user._id.toString(),
            eventType: PAGE_VIEW,
            page: '/processor-batch',
          },
        ],
      })

      expect(outcome.summary.inserted).toBe(1)
      expect(outcome.results[0].success).toBe(true)
    })
  })

  describe('Background job handlers', () => {
    it('includes weekly report and monthly cleanup handlers', () => {
      expect(jobHandlers['weekly-report-prep']).toBeDefined()
      expect(jobHandlers['monthly-cleanup']).toBeDefined()
    })

    it('runs weekly report prep placeholder', async () => {
      const result = await runJobByName('weekly-report-prep')

      expect(result.status).toBe('prepared')
      expect(result.reportType).toBe('weekly-summary')
    })
  })

  describe('Future extension processors', () => {
    it('defers ML jobs with placeholder response', async () => {
      const result = await processMlJob({ jobType: 'churn-prediction' })

      expect(result.status).toBe('deferred')
      expect(result.jobType).toBe('churn-prediction')
    })

    it('defers report generation through report processor', async () => {
      const result = await processReportJob({ reportType: 'monthly-export' })

      expect(result.status).toBe('prepared')
      expect(result.reportType).toBe('monthly-export')
    })
  })
})
