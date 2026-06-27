import mongoose from 'mongoose'
import {
  request,
  app,
  seedTestCourses,
  createTestCourse,
} from './helpers.js'

describe('Course API', () => {
  beforeEach(async () => {
    await seedTestCourses()
  })

  describe('GET /api/courses', () => {
    it('returns courses', async () => {
      const response = await request(app).get('/api/courses')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.courses)).toBe(true)
      expect(response.body.courses.length).toBeGreaterThan(0)
      expect(response.body.totalCourses).toBeGreaterThan(0)
    })

    it('supports pagination', async () => {
      const response = await request(app).get('/api/courses?page=1&limit=2')

      expect(response.status).toBe(200)
      expect(response.body.courses).toHaveLength(2)
      expect(response.body.currentPage).toBe(1)
      expect(response.body.totalPages).toBeGreaterThan(1)
    })

    it('supports search', async () => {
      const response = await request(app).get('/api/courses?search=React')

      expect(response.status).toBe(200)
      expect(response.body.courses.length).toBeGreaterThan(0)
      expect(
        response.body.courses.some((course) =>
          course.title.toLowerCase().includes('react')
        )
      ).toBe(true)
    })

    it('supports category filter', async () => {
      const response = await request(app).get('/api/courses?category=Backend')

      expect(response.status).toBe(200)
      expect(response.body.courses.length).toBeGreaterThan(0)
      expect(
        response.body.courses.every((course) => course.category === 'Backend')
      ).toBe(true)
    })
  })

  describe('GET /api/courses/:id', () => {
    it('returns a course by id', async () => {
      const course = await createTestCourse({ title: 'Unique Course Title' })

      const response = await request(app).get(`/api/courses/${course._id}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.course.title).toBe('Unique Course Title')
    })

    it('returns 400 for invalid ObjectId', async () => {
      const response = await request(app).get('/api/courses/invalid-id')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid id')
    })

    it('returns 404 for non-existing course', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const response = await request(app).get(`/api/courses/${fakeId}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Course not found')
    })
  })
})
