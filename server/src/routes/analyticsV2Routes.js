import { Router } from 'express'
import {
  getDevices,
  getCourses,
  getVideos,
  getQuizzes,
  getUsers,
  getFunnels,
  getTimeSeries,
} from '../controllers/analyticsV2Controller.js'

const router = Router()

router.get('/devices', getDevices)
router.get('/courses', getCourses)
router.get('/videos', getVideos)
router.get('/quizzes', getQuizzes)
router.get('/users', getUsers)
router.get('/funnels', getFunnels)
router.get('/timeseries', getTimeSeries)

export default router
