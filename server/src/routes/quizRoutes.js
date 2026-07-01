import express from 'express'
import {
  getQuizForCourse,
  submitQuiz,
  getMyQuizAttempts,
  getCourseQuizResult,
  getAttemptById
} from '../controllers/quizController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/my-attempts', getMyQuizAttempts)
router.get('/attempt/:attemptId', getAttemptById)
router.get('/course/:courseId', getQuizForCourse)
router.post('/submit/:courseId', submitQuiz)
router.get('/result/:courseId', getCourseQuizResult)

export default router
