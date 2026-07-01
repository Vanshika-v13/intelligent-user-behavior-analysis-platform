import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    quizScore: {
      type: Number,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Ensure a user only gets one certificate per course
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true })

const Certificate = mongoose.model('Certificate', certificateSchema)

export default Certificate
