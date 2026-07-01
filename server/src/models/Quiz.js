import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: [v => v.length >= 2, 'At least two options are required']
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required']
  },
  explanation: {
    type: String,
    required: [true, 'Explanation is required']
  }
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      unique: true // One quiz per course
    },
    title: {
      type: String,
      required: true,
      default: 'Final Course Quiz'
    },
    description: {
      type: String,
      required: true,
      default: 'Test your knowledge on this course'
    },
    passingScore: {
      type: Number,
      required: true,
      default: 70
    },
    questions: [questionSchema]
  },
  { timestamps: true }
)

const Quiz = mongoose.model('Quiz', quizSchema)

export default Quiz
