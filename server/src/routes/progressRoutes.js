import { Router } from 'express'
import {
  getProgressHandler,
  postProgressHandler
} from '../controllers/progressController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/:courseId', protect, getProgressHandler)
router.post('/', protect, postProgressHandler)

export default router
