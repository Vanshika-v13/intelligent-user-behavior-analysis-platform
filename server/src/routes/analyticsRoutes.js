import { Router } from 'express'
import {
  getOverview,
  getSessionsAnalytics,
  getEventsAnalytics,
  getJourneysAnalytics,
  getEngagementAnalytics,
  trackEvent,
} from '../controllers/analyticsController.js'
import { getAnalyticsExport } from '../controllers/analyticsExportController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validateTrackEvent } from '../middleware/validateTrackEvent.js'

const router = Router()

router.get('/export', getAnalyticsExport)
router.get('/overview', getOverview)
router.get('/sessions', getSessionsAnalytics)
router.get('/events', getEventsAnalytics)
router.get('/journeys', getJourneysAnalytics)
router.get('/engagement', getEngagementAnalytics)
router.post('/track', protect, validateTrackEvent, trackEvent)

export default router
