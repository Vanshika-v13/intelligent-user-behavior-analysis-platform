import { Router } from 'express'
import {
  getOverview,
  getSessionsAnalytics,
  getEventsAnalytics,
  getJourneysAnalytics,
  getEngagementAnalytics,
  trackEvent,
} from '../controllers/analyticsController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/overview', getOverview)
router.get('/sessions', getSessionsAnalytics)
router.get('/events', getEventsAnalytics)
router.get('/journeys', getJourneysAnalytics)
router.get('/engagement', getEngagementAnalytics)
router.post('/track', protect, trackEvent)

export default router
