import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Server is running',
    server: {
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      nodeVersion: process.version,
    },
    timestamp: new Date().toISOString(),
  })
})

export default router
