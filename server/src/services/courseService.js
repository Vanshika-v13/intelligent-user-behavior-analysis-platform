import Course from '../models/Course.js'

const createError = (message, statusCode) => {
  const error = new Error(message)
  error.statusCode = statusCode
  return error
}

const parsePagination = ({ page, limit }) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1)
  const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
  const skip = (currentPage - 1) * pageLimit

  return { currentPage, pageLimit, skip }
}

/**
 * Returns paginated courses with optional search and category filtering.
 */
export const getCourses = async ({ page, limit, search, category }) => {
  const { currentPage, pageLimit, skip } = parsePagination({ page, limit })
  const filter = {}

  if (category) {
    filter.category = category
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  const totalCourses = await Course.countDocuments(filter)
  const totalPages = Math.ceil(totalCourses / pageLimit) || 1

  const courses = await Course.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageLimit)

  return {
    courses,
    totalCourses,
    currentPage,
    totalPages,
  }
}

/**
 * Fetches a single course by MongoDB _id.
 */
export const getCourseById = async (id) => {
  const course = await Course.findById(id)

  if (!course) {
    throw createError('Course not found', 404)
  }

  return course
}
