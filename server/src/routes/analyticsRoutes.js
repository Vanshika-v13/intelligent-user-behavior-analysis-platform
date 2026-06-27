import { Router } from 'express'
import {
  getOverview,
  getSessionsAnalytics,
  getEventsAnalytics,
  getJourneysAnalytics,
  getEngagementAnalytics,
} from '../controllers/analyticsController.js'

const router = Router()

router.get('/overview', getOverview)
router.get('/sessions', getSessionsAnalytics)
router.get('/events', getEventsAnalytics)
router.get('/journeys', getJourneysAnalytics)
router.get('/engagement', getEngagementAnalytics)

export default router
