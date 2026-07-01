import mongoose from 'mongoose'

const userQuizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number
      // Optional — populated on new attempts; legacy attempts won't have this
    },
    attemptNumber: {
      type: Number,
      default: 1
      // Optional — incremented automatically on each new attempt for same quiz
    },
    isPassed: {
      type: Boolean,
      required: true
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        questionText: {
          type: String
          // Optional — stored for self-contained result display
        },
        selectedAnswer: {
          type: String,
          required: true
        },
        correctAnswer: {
          type: String
          // Optional — stored at submit time so results need no extra quiz join
        },
        explanation: {
          type: String
          // Optional — stored for View Details display
        },
        isCorrect: {
          type: Boolean,
          required: true
        }
      }
    ],
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const UserQuizAttempt = mongoose.model('UserQuizAttempt', userQuizAttemptSchema)

export default UserQuizAttempt
