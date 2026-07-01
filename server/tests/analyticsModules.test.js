import { getTimeSeriesMetrics } from '../src/analytics/timeSeriesAnalytics.js'
import { getDeviceMetrics } from '../src/analytics/deviceAnalytics.js'
import { getCourseMetrics } from '../src/analytics/courseAnalytics.js'
import { getVideoMetrics } from '../src/analytics/videoAnalytics.js'
import { getQuizMetrics } from '../src/analytics/quizAnalytics.js'
import { getUserMetrics } from '../src/analytics/userAnalytics.js'
import { getFunnelMetrics, DEFAULT_FUNNEL_STEPS } from '../src/analytics/funnelAnalytics.js'
import {
  request,
  app,
  createTestUser,
  startTestSession,
  trackTestEvent,
} from './helpers.js'
import { PAGE_VIEW, VIDEO_PLAY } from '../src/constants/eventTypes.js'

const seedMinimalData = async () => {
  const user = await createTestUser()
  const session = await startTestSession(request(app), user._id)

  await trackTestEvent(request(app), {
    sessionId: session._id,
    userId: user._id,
    eventType: PAGE_VIEW,
    page: '/home',
  })
  await trackTestEvent(request(app), {
    sessionId: session._id,
    userId: user._id,
    eventType: VIDEO_PLAY,
    page: '/lesson',
    metadata: { videoId: 'v1', courseId: 'c1' },
  })

  await request(app).post('/api/sessions/end').send({ sessionId: session.sessionId })

  return { user, session }
}

describe('timeSeriesAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getTimeSeriesMetrics returns all series', async () => {
    const result = await getTimeSeriesMetrics({ interval: 'daily' })

    expect(result.interval).toBe('daily')
    expect(Array.isArray(result.dailyEvents)).toBe(true)
    expect(Array.isArray(result.dailyPageViews)).toBe(true)
    expect(Array.isArray(result.dailyVideoPlays)).toBe(true)
  })
})

describe('deviceAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getDeviceMetrics returns breakdown categories', async () => {
    const result = await getDeviceMetrics()

    expect(Array.isArray(result.byDeviceCategory)).toBe(true)
    expect(Array.isArray(result.byBrowser)).toBe(true)
    expect(Array.isArray(result.byOperatingSystem)).toBe(true)
  })
})

describe('courseAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getCourseMetrics returns course metric arrays', async () => {
    const result = await getCourseMetrics()

    expect(Array.isArray(result.views)).toBe(true)
    expect(Array.isArray(result.trendingCourses)).toBe(true)
    expect(Array.isArray(result.topPerformingCourses)).toBe(true)
  })
})

describe('videoAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getVideoMetrics returns video engagement data', async () => {
    const result = await getVideoMetrics()

    expect(result.videoStarts).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(result.byVideo)).toBe(true)
    expect(Array.isArray(result.mostSkippedVideos)).toBe(true)
  })
})

describe('quizAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getQuizMetrics returns quiz performance data', async () => {
    const result = await getQuizMetrics()

    expect(result).toHaveProperty('quizStarts')
    expect(result).toHaveProperty('passRate')
    expect(Array.isArray(result.questionAccuracy)).toBe(true)
  })
})

describe('userAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getUserMetrics returns user behavior data', async () => {
    const result = await getUserMetrics()

    expect(Array.isArray(result.mostActiveUsers)).toBe(true)
    expect(Array.isArray(result.inactiveUsers)).toBe(true)
    expect(result).toHaveProperty('averageSessionCount')
    expect(result).toHaveProperty('averageEngagement')
  })
})

describe('funnelAnalytics module', () => {
  beforeEach(async () => {
    await seedMinimalData()
  })

  it('getFunnelMetrics returns default funnel steps', async () => {
    const result = await getFunnelMetrics()

    expect(result.steps).toHaveLength(DEFAULT_FUNNEL_STEPS.length)
    expect(result.steps[0].step).toBe('Landing')
    expect(result).toHaveProperty('overallConversionRate')
    expect(Array.isArray(result.exitPoints)).toBe(true)
  })
})
