import { request, app } from './helpers.js'

describe('Health API', () => {
  it('GET /api/health returns 200 with success and server information', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.status).toBe('ok')
    expect(response.body.message).toBe('Server is running')
    expect(response.body.server).toBeDefined()
    expect(response.body.server.environment).toBeDefined()
    expect(response.body.server.uptime).toBeDefined()
    expect(response.body.timestamp).toBeDefined()
  })

  it('GET /api/docs serves Swagger UI', async () => {
    const response = await request(app).get('/api/docs/')

    expect(response.status).toBe(200)
    expect(response.text).toContain('swagger-ui')
  })
})
