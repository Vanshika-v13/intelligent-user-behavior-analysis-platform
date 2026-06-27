import { Router } from 'express'
import {
  getCoursesHandler,
  getCourseByIdHandler,
} from '../controllers/courseController.js'
import { validateObjectId } from '../middleware/validateObjectId.js'

const router = Router()

router.get('/courses', getCoursesHandler)
router.get('/courses/:id', validateObjectId('id'), getCourseByIdHandler)

export default router
