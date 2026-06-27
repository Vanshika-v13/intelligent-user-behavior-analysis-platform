import mongoose from 'mongoose'
import {
  request,
  app,
  createTestUser,
  startTestSession,
} from './helpers.js'

describe('Session API', () => {
  let user

  beforeEach(async () => {
    user = await createTestUser()
  })

  describe('POST /api/sessions/start', () => {
    it('starts a session successfully', async () => {
      const response = await request(app).post('/api/sessions/start').send({
        userId: user._id.toString(),
        device: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
      })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Session started successfully')
      expect(response.body.session).toBeDefined()
      expect(response.body.session.sessionId).toBeDefined()
      expect(response.body.session.isActive).toBe(true)
      expect(response.body.session.userId.toString()).toBe(user._id.toString())
    })

    it('returns error for invalid user', async () => {
      const response = await request(app).post('/api/sessions/start').send({
        userId: new mongoose.Types.ObjectId().toString(),
        device: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
      })

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User not found')
    })
  })

  describe('POST /api/sessions/end', () => {
    it('ends a session and calculates duration', async () => {
      const session = await startTestSession(request(app), user._id)

      await new Promise((resolve) => setTimeout(resolve, 1100))

      const response = await request(app).post('/api/sessions/end').send({
        sessionId: session.sessionId,
      })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Session ended successfully')
      expect(response.body.session.isActive).toBe(false)
      expect(response.body.session.duration).toBeGreaterThanOrEqual(1)
      expect(response.body.session.endTime).toBeDefined()
    })

    it('returns error for invalid session', async () => {
      const response = await request(app).post('/api/sessions/end').send({
        sessionId: 'non-existent-session-id',
      })

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Session not found')
    })

    it('returns error when session already ended', async () => {
      const session = await startTestSession(request(app), user._id)

      await request(app).post('/api/sessions/end').send({
        sessionId: session.sessionId,
      })

      const response = await request(app).post('/api/sessions/end').send({
        sessionId: session.sessionId,
      })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Session already ended')
    })
  })

  describe('GET /api/sessions/:id', () => {
    it('returns session with populated user', async () => {
      const session = await startTestSession(request(app), user._id)

      const response = await request(app).get(`/api/sessions/${session._id}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.session.userId.name).toBe(user.name)
      expect(response.body.session.userId.email).toBe(user.email)
    })

    it('returns 404 for invalid session id', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app).get(`/api/sessions/${fakeId}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Session not found')
    })
  })
})
