import { Router } from 'express'
import { createBatchEventsHandler } from '../controllers/batchEventController.js'

const router = Router()

router.post('/events/batch', createBatchEventsHandler)

export default router
