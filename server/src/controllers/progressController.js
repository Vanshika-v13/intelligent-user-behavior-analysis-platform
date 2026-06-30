import Progress from '../models/Progress.js'
import Course from '../models/Course.js'

export const getProgressHandler = async (req, res, next) => {
  try {
    const courseId = req.params.courseId
    const userId = req.user._id

    let progress = await Progress.findOne({ user: userId, course: courseId })
    if (!progress) {
      progress = { completedLessons: [], progressPercentage: 0 }
    }

    res.status(200).json({
      success: true,
      completedLessons: progress.completedLessons,
      progressPercentage: progress.progressPercentage
    })
  } catch (error) {
    next(error)
  }
}

export const postProgressHandler = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body
    const userId = req.user._id

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    let progress = await Progress.findOne({ user: userId, course: courseId })
    
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        completedLessons: [lessonId]
      })
    } else {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId)
      }
      progress.lastAccessed = Date.now()
    }

    const totalLessons = course.lessons ? course.lessons.length : 0
    if (totalLessons > 0) {
      progress.progressPercentage = Math.round((progress.completedLessons.length / totalLessons) * 100)
    } else {
      progress.progressPercentage = 100
    }

    await progress.save()

    res.status(200).json({
      success: true,
      completedLessons: progress.completedLessons,
      progressPercentage: progress.progressPercentage
    })
  } catch (error) {
    next(error)
  }
}
