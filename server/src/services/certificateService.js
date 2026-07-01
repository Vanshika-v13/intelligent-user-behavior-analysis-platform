import { v4 as uuidv4 } from 'uuid'
import Certificate from '../models/Certificate.js'
import Course from '../models/Course.js'
import Progress from '../models/Progress.js'
import UserQuizAttempt from '../models/UserQuizAttempt.js'
import User from '../models/User.js'
import { generateCertificatePDF } from './pdfService.js'

export const generateCertificateNumber = async () => {
  const year = new Date().getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const endOfYear = new Date(year, 11, 31, 23, 59, 59)
  
  const count = await Certificate.countDocuments({
    issuedAt: { $gte: startOfYear, $lte: endOfYear }
  })
  
  const sequentialNum = (count + 1).toString().padStart(4, '0')
  return `LP-${year}-${sequentialNum}`
}

export const generateCertificateForUser = async (userId, courseId) => {
  // Check if certificate already exists
  let certificate = await Certificate.findOne({ userId, courseId })
  if (certificate) {
    return { status: 'existing', certificate }
  }

  // Validate completion
  const progress = await Progress.findOne({ user: userId, course: courseId })
  if (!progress || progress.progressPercentage < 100) {
    throw new Error('Course progress is not 100%')
  }

  // User Quiz Attempt
  const quizAttempt = await UserQuizAttempt.findOne({ userId, courseId }).sort({ score: -1 })
  if (!quizAttempt || !quizAttempt.isPassed) {
    throw new Error('Course quiz not passed')
  }

  // Get user and course details
  const user = await User.findById(userId)
  const course = await Course.findById(courseId)

  if (!user || !course) {
    throw new Error('User or Course not found')
  }

  // Generate ID and Number
  const certificateId = uuidv4()
  const certificateNumber = await generateCertificateNumber()

  const certificateData = {
    userId,
    courseId,
    certificateId,
    certificateNumber,
    courseTitle: course.title,
    userName: user.name,
    quizScore: quizAttempt.score,
    issuedAt: new Date()
  }

  // Generate PDF
  const pdfUrl = await generateCertificatePDF(certificateData)

  // Save to DB
  certificate = new Certificate({
    ...certificateData,
    pdfUrl
  })

  await certificate.save()

  return { status: 'created', certificate }
}

export const getUserCertificates = async (userId) => {
  return await Certificate.find({ userId }).sort({ issuedAt: -1 })
}

export const getCertificateById = async (certificateId) => {
  return await Certificate.findOne({ certificateId })
}

export const incrementDownloadCount = async (certificateId) => {
  return await Certificate.findOneAndUpdate(
    { certificateId },
    { 
      $inc: { downloadCount: 1 },
      $set: { lastDownloadedAt: new Date() }
    },
    { new: true }
  )
}
