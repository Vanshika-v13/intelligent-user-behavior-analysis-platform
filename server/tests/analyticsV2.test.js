import {
  request,
  app,
  createTestUser,
  startTestSession,
  trackTestEvent,
} from './helpers.js'
import {
  PAGE_VIEW,
  COURSE_OPEN,
  LESSON_STARTED,
  VIDEO_PLAY,
  VIDEO_COMPLETE,
  QUIZ_START,
  QUIZ_SUBMIT,
  CERTIFICATE_GENERATED,
  CLICK,
} from '../src/constants/eventTypes.js'
import UserQuizAttempt from '../src/models/UserQuizAttempt.js'
import Progress from '../src/models/Progress.js'
import Course from '../src/models/Course.js'
import { getRegisteredAnalyticsModules } from '../src/analytics/moduleRegistry.js'

const seedPhase2Data = async () => {
  const user1 = await createTestUser({ name: 'Active User' })
  const user2 = await createTestUser({ name: 'Inactive User' })
  const course = await Course.create({
    title: 'Analytics Test Course',
    description: 'Course for Phase 2 analytics tests',
    category: 'Testing',
    duration: 60,
  })

  const session1 = await startTestSession(request(app), user1._id)
  const session2 = await startTestSession(request(app), user1._id)

  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: PAGE_VIEW,
    page: '/home',
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: COURSE_OPEN,
    page: '/courses/analytics-test',
    metadata: { courseId: course._id.toString() },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: LESSON_STARTED,
    page: '/courses/analytics-test/lesson-1',
    metadata: { courseId: course._id.toString(), lessonId: 'lesson-1' },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: VIDEO_PLAY,
    page: '/courses/analytics-test/lesson-1',
    metadata: { courseId: course._id.toString(), videoId: 'video-1' },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: VIDEO_COMPLETE,
    page: '/courses/analytics-test/lesson-1',
    metadata: { courseId: course._id.toString(), videoId: 'video-1', watchTime: 120 },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: QUIZ_START,
    page: '/courses/analytics-test/quiz',
    metadata: { courseId: course._id.toString(), quizId: 'quiz-1' },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: QUIZ_SUBMIT,
    page: '/courses/analytics-test/quiz',
    metadata: { courseId: course._id.toString(), quizId: 'quiz-1', score: 85 },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: CERTIFICATE_GENERATED,
    page: '/certificates',
    metadata: { courseId: course._id.toString() },
  })
  await trackTestEvent(request(app), {
    sessionId: session1._id,
    userId: user1._id,
    eventType: PAGE_VIEW,
    page: '/courses',
    metadata: {
      screenResolution: '1920x1080',
      language: 'en-US',
      timezone: 'America/New_York',
    },
  })

  await trackTestEvent(request(app), {
    sessionId: session2._id,
    userId: user1._id,
    eventType: CLICK,
    page: '/courses',
    metadata: { buttonId: 'enroll-btn' },
  })

  await request(app).post('/api/sessions/end').send({ sessionId: session1.sessionId })
  await request(app).post('/api/sessions/end').send({ sessionId: session2.sessionId })

  await Progress.create({
    user: user1._id,
    course: course._id,
    progressPercentage: 100,
    quizPassed: true,
    completedLessons: ['lesson-1'],
  })

  await UserQuizAttempt.create({
    userId: user1._id,
    courseId: course._id,
    quizId: course._id,
    score: 85,
    totalQuestions: 10,
    isPassed: true,
    answers: [
      {
        questionId: course._id,
        questionText: 'Sample question',
        selectedAnswer: 'A',
        correctAnswer: 'A',
        isCorrect: true,
      },
      {
        questionId: course._id,
        questionText: 'Hard question',
        selectedAnswer: 'B',
        correctAnswer: 'A',
        isCorrect: false,
      },
    ],
  })

  return { user1, user2, course, session1 }
}

describe('Phase 2 Analytics V2 API', () => {
  let seeded

  beforeEach(async () => {
    seeded = await seedPhase2Data()
  })

  describe('Module registry', () => {
    it('registers all Phase 2 modules at startup', () => {
      const modules = getRegisteredAnalyticsModules()
      const names = modules.map((m) => m.name)

      expect(names).toContain('devices')
      expect(names).toContain('courses')
      expect(names).toContain('videos')
      expect(names).toContain('quizzes')
      expect(names).toContain('users')
      expect(names).toContain('funnels')
      expect(names).toContain('timeseries')
    })
  })

  describe('GET /api/v2/analytics/devices', () => {
    it('returns device analytics', async () => {
      const response = await request(app).get('/api/v2/analytics/devices')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.byDeviceCategory)).toBe(true)
      expect(Array.isArray(response.body.data.byOperatingSystem)).toBe(true)
      expect(Array.isArray(response.body.data.byBrowser)).toBe(true)
    })
  })

  describe('GET /api/v2/analytics/courses', () => {
    it('returns course analytics', async () => {
      const response = await request(app).get('/api/v2/analytics/courses')

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty('views')
      expect(response.body.data).toHaveProperty('opens')
      expect(response.body.data).toHaveProperty('topPerformingCourses')
      expect(response.body.data).toHaveProperty('trendingCourses')
    })
  })

  describe('GET /api/v2/analytics/videos', () => {
    it('returns video analytics', async () => {
      const response = await request(app).get('/api/v2/analytics/videos')

      expect(response.status).toBe(200)
      expect(response.body.data.videoStarts).toBeGreaterThanOrEqual(1)
      expect(response.body.data.videoCompletes).toBeGreaterThanOrEqual(1)
      expect(response.body.data).toHaveProperty('completionRate')
      expect(response.body.data).toHaveProperty('mostReplayedVideos')
    })
  })

  describe('GET /api/v2/analytics/quizzes', () => {
    it('returns quiz analytics', async () => {
      const response = await request(app).get('/api/v2/analytics/quizzes')

      expect(response.status).toBe(200)
      expect(response.body.data.quizStarts).toBeGreaterThanOrEqual(1)
      expect(response.body.data.quizSubmissions).toBeGreaterThanOrEqual(1)
      expect(response.body.data).toHaveProperty('passRate')
      expect(response.body.data).toHaveProperty('mostIncorrectQuestions')
    })
  })

  describe('GET /api/v2/analytics/users', () => {
    it('returns user analytics', async () => {
      const response = await request(app).get('/api/v2/analytics/users')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data.mostActiveUsers)).toBe(true)
      expect(response.body.data.mostActiveUsers.length).toBeGreaterThan(0)
      expect(response.body.data).toHaveProperty('returningUsers')
      expect(response.body.data).toHaveProperty('firstTimeUsers')
    })
  })

  describe('GET /api/v2/analytics/funnels', () => {
    it('returns funnel analytics', async () => {
      const response = await request(app).get('/api/v2/analytics/funnels')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data.steps)).toBe(true)
      expect(response.body.data.steps.length).toBe(6)
      expect(response.body.data).toHaveProperty('overallConversionRate')
      expect(Array.isArray(response.body.data.exitPoints)).toBe(true)
    })
  })

  describe('GET /api/v2/analytics/timeseries', () => {
    it('returns time series analytics with daily interval', async () => {
      const response = await request(app).get('/api/v2/analytics/timeseries')

      expect(response.status).toBe(200)
      expect(response.body.data.interval).toBe('daily')
      expect(Array.isArray(response.body.data.dailyEvents)).toBe(true)
      expect(Array.isArray(response.body.data.dailySessions)).toBe(true)
      expect(Array.isArray(response.body.data.dailyUsers)).toBe(true)
    })

    it('supports weekly interval', async () => {
      const response = await request(app).get(
        '/api/v2/analytics/timeseries?interval=weekly'
      )

      expect(response.status).toBe(200)
      expect(response.body.data.interval).toBe('weekly')
    })
  })

  describe('Analytics filters', () => {
    it('filters v2 endpoints by courseId', async () => {
      const response = await request(app).get(
        `/api/v2/analytics/courses?courseId=${seeded.course._id}`
      )

      expect(response.status).toBe(200)
      expect(response.body.data.opens.length).toBeGreaterThanOrEqual(1)
    })

    it('returns 400 for invalid date on v2 endpoint', async () => {
      const response = await request(app).get(
        '/api/v2/analytics/devices?startDate=invalid'
      )

      expect(response.status).toBe(400)
    })
  })
})

describe('Phase 1 date range filtering (backward compatible)', () => {
  beforeEach(async () => {
    await seedPhase2Data()
  })

  it('returns identical shape without date params', async () => {
    const response = await request(app).get('/api/analytics/events')

    expect(response.status).toBe(200)
    expect(response.body.data).toHaveProperty('eventDistribution')
    expect(response.body.data).toHaveProperty('mostVisitedPages')
  })

  it('supports startDate and endDate on events endpoint', async () => {
    const today = new Date().toISOString().split('T')[0]
    const response = await request(app).get(
      `/api/analytics/events?startDate=${today}&endDate=${today}`
    )

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data.eventDistribution)).toBe(true)
  })

  it('supports date filtering on overview endpoint', async () => {
    const today = new Date().toISOString().split('T')[0]
    const response = await request(app).get(
      `/api/analytics/overview?startDate=${today}&endDate=${today}`
    )

    expect(response.status).toBe(200)
    expect(response.body.data.totalEvents).toBeGreaterThanOrEqual(1)
  })
})
