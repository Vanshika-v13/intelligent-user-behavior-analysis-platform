import { Router } from 'express'
import {
  createEventHandler,
  getEventsHandler,
  getEventByIdHandler,
  getEventsBySessionHandler,
  getEventsByUserHandler,
} from '../controllers/eventController.js'
import { validateObjectId } from '../middleware/validateObjectId.js'
import { validateEvent } from '../middleware/validateEvent.js'

const router = Router()

router.post('/events', validateEvent, createEventHandler)
router.get('/events', getEventsHandler)
router.get(
  '/events/session/:sessionId',
  validateObjectId('sessionId'),
  getEventsBySessionHandler
)
router.get(
  '/events/user/:userId',
  validateObjectId('userId'),
  getEventsByUserHandler
)
router.get('/events/:id', validateObjectId('id'), getEventByIdHandler)

export default router
