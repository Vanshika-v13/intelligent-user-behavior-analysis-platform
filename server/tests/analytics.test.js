import {
  request,
  app,
  createTestUser,
  startTestSession,
  trackTestEvent,
} from './helpers.js'
import {
  PAGE_VIEW,
  CLICK,
  SEARCH,
  SESSION_END,
} from '../src/constants/eventTypes.js'

describe('Analytics API', () => {
  let user
  let session

  beforeEach(async () => {
    user = await createTestUser()
    session = await startTestSession(request(app), user._id)

    await trackTestEvent(request(app), {
      sessionId: session._id,
      userId: user._id,
      eventType: PAGE_VIEW,
      page: '/courses',
    })
    await trackTestEvent(request(app), {
      sessionId: session._id,
      userId: user._id,
      eventType: CLICK,
      page: '/courses',
      metadata: { buttonId: 'course-card-1' },
    })
    await trackTestEvent(request(app), {
      sessionId: session._id,
      userId: user._id,
      eventType: SEARCH,
      page: '/courses',
      metadata: { searchQuery: 'JavaScript' },
    })

    await request(app).post('/api/sessions/end').send({
      sessionId: session.sessionId,
    })
  })

  describe('GET /api/analytics/overview', () => {
    it('returns overview metrics', async () => {
      const response = await request(app).get('/api/analytics/overview')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.totalUsers).toBeGreaterThanOrEqual(1)
      expect(response.body.data.totalSessions).toBeGreaterThanOrEqual(1)
      expect(response.body.data.totalEvents).toBeGreaterThanOrEqual(3)
      expect(response.body.data).toHaveProperty('averageSessionDuration')
      expect(response.body.data).toHaveProperty('bounceRate')
      expect(response.body.data).toHaveProperty('activeUsers')
    })
  })

  describe('GET /api/analytics/sessions', () => {
    it('returns session analytics', async () => {
      const response = await request(app).get('/api/analytics/sessions')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('averageSessionDuration')
      expect(response.body.data).toHaveProperty('bounceRate')
      expect(response.body.data).toHaveProperty('activeUsers')
      expect(Array.isArray(response.body.data.sessionDistribution)).toBe(true)
    })
  })

  describe('GET /api/analytics/events', () => {
    it('returns event analytics', async () => {
      const response = await request(app).get('/api/analytics/events')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.eventDistribution)).toBe(true)
      expect(Array.isArray(response.body.data.mostVisitedPages)).toBe(true)
      expect(Array.isArray(response.body.data.mostClickedButtons)).toBe(true)
      expect(Array.isArray(response.body.data.mostSearchedCourses)).toBe(true)
    })
  })

  describe('GET /api/analytics/journeys', () => {
    it('returns journey analytics', async () => {
      const response = await request(app).get('/api/analytics/journeys')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('userJourneys')
      expect(Array.isArray(response.body.data.dropOffPages)).toBe(true)
      expect(Array.isArray(response.body.data.pageTransitions)).toBe(true)
    })

    it('supports sessionId query parameter', async () => {
      const response = await request(app).get(
        `/api/analytics/journeys?sessionId=${session._id}`
      )

      expect(response.status).toBe(200)
      expect(response.body.data.userJourneys).toHaveLength(1)
      expect(response.body.data.userJourneys[0].sessionId).toBe(
        session._id.toString()
      )
      expect(Array.isArray(response.body.data.userJourneys[0].journey)).toBe(
        true
      )
    })
  })

  describe('GET /api/analytics/engagement', () => {
    it('returns engagement analytics for all users', async () => {
      const response = await request(app).get('/api/analytics/engagement')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data.engagementScores)).toBe(true)
      expect(Array.isArray(response.body.data.engagementLevels)).toBe(true)
      expect(response.body.data.engagementScores.length).toBeGreaterThan(0)
    })

    it('supports userId query parameter', async () => {
      const response = await request(app).get(
        `/api/analytics/engagement?userId=${user._id}`
      )

      expect(response.status).toBe(200)
      expect(response.body.data.engagementScores).toHaveLength(1)
      expect(response.body.data.engagementScores[0].userId).toBe(
        user._id.toString()
      )
      expect(response.body.data.engagementScores[0].engagementScore).toBeGreaterThanOrEqual(0)
      expect(['Low', 'Medium', 'High']).toContain(
        response.body.data.engagementLevels[0].level
      )
    })
  })
})

describe('Integration – complete user journey', () => {
  it('tracks events through session lifecycle and reflects in analytics', async () => {
    const user = await createTestUser({ name: 'Journey User' })

    const startResponse = await request(app).post('/api/sessions/start').send({
      userId: user._id.toString(),
      device: 'mobile',
      browser: 'Safari',
      os: 'iOS',
    })

    expect(startResponse.status).toBe(201)
    const { session } = startResponse.body

    const events = [
      { eventType: PAGE_VIEW, page: '/home' },
      { eventType: PAGE_VIEW, page: '/courses' },
      { eventType: CLICK, page: '/courses', metadata: { buttonId: 'view-course' } },
      { eventType: SEARCH, page: '/courses', metadata: { searchQuery: 'Node.js' } },
      { eventType: SESSION_END, page: '/courses' },
    ]

    for (const event of events) {
      const eventResponse = await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        ...event,
      })
      expect(eventResponse.eventType).toBe(event.eventType)
    }

    const endResponse = await request(app).post('/api/sessions/end').send({
      sessionId: session.sessionId,
    })

    expect(endResponse.status).toBe(200)
    expect(endResponse.body.session.duration).toBeGreaterThanOrEqual(0)

    const sessionEvents = await request(app).get(
      `/api/events/session/${session._id}`
    )
    expect(sessionEvents.body.events).toHaveLength(5)

    const overview = await request(app).get('/api/analytics/overview')
    expect(overview.body.data.totalEvents).toBeGreaterThanOrEqual(5)

    const journeys = await request(app).get(
      `/api/analytics/journeys?sessionId=${session._id}`
    )
    expect(journeys.body.data.userJourneys[0].journey.length).toBeGreaterThan(0)

    const engagement = await request(app).get(
      `/api/analytics/engagement?userId=${user._id}`
    )
    expect(engagement.body.data.engagementScores[0].engagementScore).toBeGreaterThan(0)
    expect(engagement.body.data.engagementLevels[0].level).toBeDefined()
  })
})
