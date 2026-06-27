import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/User.js'
import Course from '../src/models/Course.js'
import seedCourses from '../src/utils/seedCourses.js'

export { request, app }

export const createTestUser = async (overrides = {}) => {
  return User.create({
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    ...overrides,
  })
}

export const seedTestCourses = async () => seedCourses()

export const createTestCourse = async (overrides = {}) => {
  return Course.create({
    title: 'Test Course',
    description: 'A course for automated testing purposes',
    category: 'Testing',
    duration: 120,
    ...overrides,
  })
}

export const startTestSession = async (agent, userId) => {
  const response = await agent.post('/api/sessions/start').send({
    userId: userId.toString(),
    device: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
  })

  if (response.status !== 201 || !response.body.session) {
    throw new Error(
      `Failed to start test session: ${response.status} ${JSON.stringify(response.body)}`
    )
  }

  return response.body.session
}

export const trackTestEvent = async (agent, { sessionId, userId, eventType, page, metadata }) => {
  const response = await agent.post('/api/events').send({
    sessionId: sessionId.toString(),
    userId: userId.toString(),
    eventType,
    page,
    metadata,
  })

  if (response.status !== 201 || !response.body.event) {
    throw new Error(
      `Failed to track test event: ${response.status} ${JSON.stringify(response.body)}`
    )
  }

  return response.body.event
}
