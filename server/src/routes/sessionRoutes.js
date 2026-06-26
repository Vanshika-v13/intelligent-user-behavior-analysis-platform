import { Router } from 'express'
import {
  startSession,
  endSessionHandler,
  getSessionById,
} from '../controllers/sessionController.js'
import { validateObjectId } from '../middleware/validateObjectId.js'
import {
  validateStartSession,
  validateEndSession,
} from '../middleware/validateSession.js'

const router = Router()

router.post('/sessions/start', validateStartSession, startSession)
router.post('/sessions/end', validateEndSession, endSessionHandler)
router.get('/sessions/:id', validateObjectId('id'), getSessionById)

export default router
