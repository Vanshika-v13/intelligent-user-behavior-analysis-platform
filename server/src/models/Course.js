import mongoose from 'mongoose'

/**
 * Course schema — catalog entry for learning content tracked in user sessions.
 */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'Course duration is required'],
      min: [0, 'Duration cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
)

// Supports filtering and grouping courses by category
courseSchema.index({ category: 1 })

const Course = mongoose.model('Course', courseSchema)

export default Course
