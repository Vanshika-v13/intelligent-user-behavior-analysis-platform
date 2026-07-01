import { Router } from 'express'
import {
  getProgressHandler,
  postProgressHandler,
  getAllProgressHandler
} from '../controllers/progressController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', protect, getAllProgressHandler)
router.get('/:courseId', protect, getProgressHandler)
router.post('/', protect, postProgressHandler)

export default router
