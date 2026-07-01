import Progress from '../models/Progress.js'
import Course from '../models/Course.js'

export const getProgressHandler = async (req, res, next) => {
  try {
    const courseId = req.params.courseId
    const userId = req.user._id

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    let progress = await Progress.findOne({ user: userId, course: courseId })
    if (!progress) {
      progress = { completedLessons: [], progressPercentage: 0, quizPassed: false, isLegacyCompleted: false }
    } else {
      // Compatibility check: If progress was already 100% before quiz system was introduced
      if (progress.progressPercentage === 100 && !progress.quizPassed && !progress.isLegacyCompleted) {
        progress.isLegacyCompleted = true;
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      completedLessons: progress.completedLessons,
      progressPercentage: progress.progressPercentage,
      quizPassed: progress.quizPassed,
      isLegacyCompleted: progress.isLegacyCompleted
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
      // Compatibility check
      if (progress.progressPercentage === 100 && !progress.quizPassed && !progress.isLegacyCompleted) {
        progress.isLegacyCompleted = true;
      }

      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId)
      }
      progress.lastAccessed = Date.now()
    }

    const totalLessons = course.lessons ? course.lessons.length : 0
    if (progress.isLegacyCompleted) {
      progress.progressPercentage = 100;
    } else if (totalLessons > 0) {
      const lessonsPercentage = (progress.completedLessons.length / totalLessons) * 80;
      progress.progressPercentage = Math.round(lessonsPercentage + (progress.quizPassed ? 20 : 0));
    } else {
      progress.progressPercentage = 100
    }

    await progress.save()

    res.status(200).json({
      success: true,
      completedLessons: progress.completedLessons,
      progressPercentage: progress.progressPercentage,
      quizPassed: progress.quizPassed,
      isLegacyCompleted: progress.isLegacyCompleted
    })
  } catch (error) {
    next(error)
  }
}

export const getAllProgressHandler = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all progress documents for this user and populate the course details
    const progresses = await Progress.find({ user: userId })
      .populate('course', 'title thumbnail category duration lessons')
      .sort({ lastAccessed: -1 });

    res.status(200).json({
      success: true,
      progresses
    });
  } catch (error) {
    next(error);
  }
};
