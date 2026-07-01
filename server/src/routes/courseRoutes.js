import { Router } from 'express'
import {
  getCoursesHandler,
  getCourseByIdHandler,
  getCategoriesHandler,
  getStatsHandler,
} from '../controllers/courseController.js'
import { validateObjectId } from '../middleware/validateObjectId.js'

const router = Router()

router.get('/stats', getStatsHandler)
router.get('/courses', getCoursesHandler)
router.get('/categories', getCategoriesHandler)
router.get('/courses/:id', validateObjectId('id'), getCourseByIdHandler)

export default router
