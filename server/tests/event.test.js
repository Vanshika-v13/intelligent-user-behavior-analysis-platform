import mongoose from 'mongoose'
import {
  request,
  app,
  createTestUser,
  startTestSession,
  trackTestEvent,
} from './helpers.js'
import { PAGE_VIEW, CLICK, SEARCH } from '../src/constants/eventTypes.js'

describe('Event API', () => {
  let user
  let session

  beforeEach(async () => {
    user = await createTestUser()
    session = await startTestSession(request(app), user._id)
  })

  describe('POST /api/events', () => {
    it('creates an event successfully', async () => {
      const response = await request(app).post('/api/events').send({
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        eventType: PAGE_VIEW,
        page: '/courses',
        metadata: { source: 'test' },
      })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.event.eventType).toBe(PAGE_VIEW)
      expect(response.body.event.page).toBe('/courses')
    })

    it('validates invalid event type', async () => {
      const response = await request(app).post('/api/events').send({
        sessionId: session._id.toString(),
        userId: user._id.toString(),
        eventType: 'INVALID_EVENT',
        page: '/courses',
      })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid event type')
    })
  })

  describe('GET /api/events', () => {
    beforeEach(async () => {
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
        metadata: { buttonId: 'enroll-btn' },
      })
      await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: SEARCH,
        page: '/courses',
        metadata: { searchQuery: 'React' },
      })
    })

    it('returns events with pagination', async () => {
      const response = await request(app).get('/api/events?page=1&limit=2')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.events).toHaveLength(2)
      expect(response.body.totalEvents).toBe(3)
      expect(response.body.totalPages).toBe(2)
    })

    it('filters by event type', async () => {
      const response = await request(app).get(`/api/events?eventType=${CLICK}`)

      expect(response.status).toBe(200)
      expect(response.body.events).toHaveLength(1)
      expect(response.body.events[0].eventType).toBe(CLICK)
    })
  })

  describe('GET /api/events/:id', () => {
    it('returns event by id', async () => {
      const event = await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: PAGE_VIEW,
        page: '/dashboard',
      })

      const response = await request(app).get(`/api/events/${event._id}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.event._id).toBe(event._id.toString())
    })

    it('returns 404 when event not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app).get(`/api/events/${fakeId}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Event not found')
    })

    it('returns 400 for invalid id', async () => {
      const response = await request(app).get('/api/events/not-valid')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/events/session/:sessionId', () => {
    it('returns events for a session', async () => {
      await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: PAGE_VIEW,
        page: '/home',
      })

      const response = await request(app).get(
        `/api/events/session/${session._id}`
      )

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.events.length).toBeGreaterThan(0)
      expect(response.body.events[0].sessionId.toString()).toBe(
        session._id.toString()
      )
    })
  })

  describe('GET /api/events/user/:userId', () => {
    it('returns events for a user with pagination', async () => {
      await trackTestEvent(request(app), {
        sessionId: session._id,
        userId: user._id,
        eventType: PAGE_VIEW,
        page: '/profile',
      })

      const response = await request(app).get(
        `/api/events/user/${user._id}?page=1&limit=10`
      )

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.events.length).toBeGreaterThan(0)
      expect(response.body.events[0].userId.toString()).toBe(user._id.toString())
    })

    it('returns 400 for invalid user id', async () => {
      const response = await request(app).get('/api/events/user/bad-id')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })
})
