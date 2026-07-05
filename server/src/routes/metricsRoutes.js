import { Router } from 'express'
import { getMetricsHandler } from '../metrics/metricsController.js'

const router = Router()

router.get('/metrics', getMetricsHandler)

export default router
