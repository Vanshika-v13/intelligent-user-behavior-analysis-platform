import { getCourses, getCourseById, getCategories } from '../services/courseService.js'

export const getCoursesHandler = async (req, res, next) => {
  try {
    const { page, limit, search, category } = req.query
    const result = await getCourses({ page, limit, search, category })

    res.status(200).json({
      success: true,
      totalCourses: result.totalCourses,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      courses: result.courses,
    })
  } catch (error) {
    next(error)
  }
}

export const getCourseByIdHandler = async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.id)

    res.status(200).json({
      success: true,
      course,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategoriesHandler = async (req, res, next) => {
  try {
    const categories = await getCategories()

    res.status(200).json({
      success: true,
      categories,
    })
  } catch (error) {
    next(error)
  }
}
