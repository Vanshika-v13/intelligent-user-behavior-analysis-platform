import Quiz from '../models/Quiz.js'
import UserQuizAttempt from '../models/UserQuizAttempt.js'
import Progress from '../models/Progress.js'
import Course from '../models/Course.js'

// ─── GET QUIZ FOR A COURSE (sanitized — no correct answers) ──────────────────
export const getQuizForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    const quiz = await Quiz.findOne({ courseId }).lean();
    
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found for this course' });
    }

    // Strip correct answers and explanations before sending to client
    const sanitizedQuestions = quiz.questions.map(q => {
      const { correctAnswer, explanation, ...rest } = q;
      return rest;
    });

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        courseId: quiz.courseId,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,
        questions: sanitizedQuestions
      }
    });

  } catch (error) {
    next(error);
  }
};

// ─── SUBMIT QUIZ ─────────────────────────────────────────────────────────────
export const submitQuiz = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // array of { questionId, selectedAnswer }
    const userId = req.user._id;

    const quiz = await Quiz.findOne({ courseId });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const evaluatedAnswers = [];

    quiz.questions.forEach(q => {
      const userAnswer = answers.find(a => a.questionId.toString() === q._id.toString());
      const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : '';
      const isCorrect = selectedAnswer === q.correctAnswer;
      
      if (isCorrect) correctCount++;
      
      evaluatedAnswers.push({
        questionId: q._id,
        questionText: q.question,          // Store for self-contained result display
        selectedAnswer,
        correctAnswer: q.correctAnswer,    // Store so results need no extra quiz join
        explanation: q.explanation || '',  // Store explanation if available
        isCorrect
      });
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = scorePercentage >= quiz.passingScore;

    // Compute attemptNumber: count existing attempts for this user + quiz, then increment
    const previousAttempts = await UserQuizAttempt.countDocuments({ userId, quizId: quiz._id });
    const attemptNumber = previousAttempts + 1;

    const attempt = new UserQuizAttempt({
      userId,
      courseId,
      quizId: quiz._id,
      score: scorePercentage,
      totalQuestions,
      attemptNumber,
      isPassed,
      answers: evaluatedAnswers
    });

    await attempt.save();
    console.log('[submitQuiz] ✅ Attempt saved:', {
      attemptId: attempt._id,
      userId: userId.toString(),
      courseId,
      score: scorePercentage,
      isPassed,
      attemptNumber
    });

    // If passed, update Progress
    if (isPassed) {
      let progress = await Progress.findOne({ user: userId, course: courseId });
      const course = await Course.findById(courseId);
      
      if (progress && !progress.quizPassed && !progress.isLegacyCompleted) {
        progress.quizPassed = true;
        
        const totalLessons = course.lessons ? course.lessons.length : 0;
        if (totalLessons > 0) {
          const lessonsPercentage = (progress.completedLessons.length / totalLessons) * 80;
          progress.progressPercentage = Math.round(lessonsPercentage + 20);
        } else {
          progress.progressPercentage = 100;
        }
        
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      result: {
        score: scorePercentage,
        isPassed,
        correctCount,
        totalQuestions,
        attemptNumber,
        attemptId: attempt._id
      }
    });

  } catch (error) {
    next(error);
  }
};

// ─── GET ALL MY QUIZ ATTEMPTS (Dashboard: Quiz Results list) ─────────────────
export const getMyQuizAttempts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log('[getMyQuizAttempts] querying for userId:', userId.toString());
    const attempts = await UserQuizAttempt.find({ userId })
      .populate('courseId', 'title thumbnail')
      .populate('quizId', 'title passingScore')
      .sort({ completedAt: -1 })
      .lean();

    console.log('[getMyQuizAttempts] found', attempts.length, 'attempt(s)');
    res.status(200).json({
      success: true,
      attempts
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET MOST RECENT QUIZ RESULT FOR A COURSE ────────────────────────────────
export const getCourseQuizResult = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Get the most recent attempt for this course
    const attempt = await UserQuizAttempt.findOne({ userId, courseId })
      .populate('courseId', 'title thumbnail')
      .populate('quizId', 'title passingScore')
      .sort({ completedAt: -1 })
      .lean();

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'No attempt found' });
    }

    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET A SINGLE ATTEMPT BY ID (View Details) ───────────────────────────────
export const getAttemptById = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user._id;

    const attempt = await UserQuizAttempt.findById(attemptId)
      .populate('courseId', 'title thumbnail')
      .populate('quizId', 'title passingScore description')
      .lean();

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }

    // Security check: user can only view their own attempts
    if (attempt.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this attempt' });
    }

    // ── Backward-compatibility: inject correctAnswer + explanation for old attempts ──
    // Old attempts were saved before correctAnswer was stored in the answers subdoc.
    // If any answer is missing correctAnswer, fetch the Quiz and reconstruct it.
    const needsEnrichment = attempt.answers?.some(
      (a) => a.correctAnswer === undefined || a.correctAnswer === null || a.correctAnswer === ''
    );

    if (needsEnrichment && attempt.quizId) {
      try {
        // quizId may already be the populated object (has _id) or a raw ObjectId string
        const quizObjectId = attempt.quizId._id || attempt.quizId;
        const quiz = await Quiz.findById(quizObjectId).lean();

        if (quiz && quiz.questions) {
          // Build a map of questionId → { correctAnswer, explanation }
          const questionMap = {};
          quiz.questions.forEach((q) => {
            questionMap[q._id.toString()] = {
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || ''
            };
          });

          // Inject missing fields into each answer
          attempt.answers = attempt.answers.map((a) => {
            if (!a.correctAnswer && a.questionId) {
              const match = questionMap[a.questionId.toString()];
              if (match) {
                return {
                  ...a,
                  correctAnswer: match.correctAnswer,
                  explanation: a.explanation || match.explanation
                };
              }
            }
            return a;
          });
        }
      } catch (enrichErr) {
        // Non-fatal: log and continue — the attempt is still returned as-is
        console.warn('[getAttemptById] Could not enrich old attempt with quiz data:', enrichErr.message);
      }
    }

    res.status(200).json({
      success: true,
      attempt
    });
  } catch (error) {
    next(error);
  }
};
