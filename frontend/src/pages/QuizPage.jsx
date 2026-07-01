import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuizForCourse, submitQuiz } from '../services/quizService';
import { courseService } from '../services/courseService';
import { progressService } from '../services/progressService';
import { ROUTES } from '../constants/routes';
import { Lock, BookOpen } from 'lucide-react';

const QuizSkeleton = () => (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4">
    <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-pulse">
      <div className="h-32 bg-[#F1F5F9] w-full"></div>
      <div className="p-8 md:p-10 space-y-6">
        <div className="h-6 bg-[#F1F5F9] rounded-full w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-[#F1F5F9] rounded-2xl w-full"></div>)}
        </div>
        <div className="h-12 bg-[#F1F5F9] rounded-xl w-32 mt-8"></div>
      </div>
    </div>
  </div>
);

const QuizEmptyState = ({ courseId }) => (
  <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-12 px-4">
    <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden p-10 text-center animate-[fadeIn_0.5s_ease-out]">
      <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6 text-[#94A3B8]">
        <Lock size={32} />
      </div>
      <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">No Quiz Attempts Yet</h2>
      <p className="text-[#64748B] font-medium mb-8">
        Complete your course lessons to unlock quizzes.
      </p>
      <Link 
        to={courseId ? ROUTES.COURSE_DETAIL_PATH(courseId) : ROUTES.MY_LEARNING}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0F172A] text-white rounded-xl font-bold shadow-sm hover:bg-[#1E293B] hover:-translate-y-0.5 transition-all w-full"
      >
        <BookOpen size={18} /> Go to My Learning
      </Link>
    </div>
  </div>
);

const QuizPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no courseId is provided (e.g. /dashboard/quizzes), we stop loading and let it fall into empty state safely
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, progressData] = await Promise.all([
          courseService.getCourseById(courseId).catch(() => null),
          progressService.getProgress(courseId).catch(() => null)
        ]);

        if (!courseData) {
          setError('Course not found.');
          setLoading(false);
          return;
        }

        const courseObj = courseData.course || courseData;
        setCourse(courseObj);
        
        // Ensure userProgress structure for conditions
        setUserProgress({
          enrolled: !!progressData,
          completedLessons: progressData?.completedLessons || [],
          isLegacyCompleted: progressData?.isLegacyCompleted,
          quizPassed: progressData?.quizPassed
        });

        const totalLessons = courseObj.lessons?.length || 0;
        const completedLessonsCount = progressData?.completedLessons?.length || 0;
        
        const canAttemptQuiz = (progressData && totalLessons > 0 && completedLessonsCount === totalLessons) || 
                               progressData?.isLegacyCompleted || 
                               progressData?.quizPassed;

        if (canAttemptQuiz) {
          try {
            const quizData = await getQuizForCourse(courseId);
            setQuiz(quizData.quiz);
          } catch (err) {
            if (err.response?.status === 404) {
              // No quiz exists for this course — not an error, just missing content
              setQuiz(null);
            } else {
              setError('Failed to load quiz. Please try again later.');
            }
          }
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, selectedAnswer: option } : a);
      }
      return [...prev, { questionId, selectedAnswer: option }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.length < quiz.questions.length) {
      const confirmSubmit = window.confirm("You haven't answered all questions. Submit anyway?");
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      await submitQuiz(courseId, answers);
      navigate(ROUTES.COURSE_DETAIL_PATH(courseId) + '/quiz-result');
    } catch (err) {
      setError('Failed to submit quiz.');
      setSubmitting(false);
    }
  };

  // Guard conditions based on requirements
  const isLoading = loading || (!course && courseId && !error) || (courseId && !userProgress && !error);
  
  const canAttemptQuiz =
    userProgress?.enrolled &&
    course?.lessons &&
    (userProgress?.completedLessons?.length === course.lessons.length || userProgress?.isLegacyCompleted || userProgress?.quizPassed);

  // Error State (if courseId was valid but not found)
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center px-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E2E8F0] text-center max-w-md">
          <div className="text-[#EF4444] font-bold text-lg mb-2">Error</div>
          <p className="text-[#64748B] mb-6">{error}</p>
          <Link to={courseId ? ROUTES.COURSE_DETAIL_PATH(courseId) : ROUTES.MY_LEARNING} className="inline-flex px-6 py-2.5 bg-[#F1F5F9] text-[#0F172A] font-bold rounded-xl hover:bg-[#E2E8F0] transition-colors">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // GLOBAL SAFETY RULE (MANDATORY)
  if (isLoading) return <QuizSkeleton />;
  if (!canAttemptQuiz) return <QuizEmptyState courseId={courseId} />;

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center px-4">
        <div className="text-[#64748B] font-medium">No quiz configuration found for this course.</div>
      </div>
    );
  }

  // Active Quiz State
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = answers.find(a => a.questionId === currentQuestion._id)?.selectedAnswer;
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden transition-all duration-300">
        
        <div className="bg-[#0F172A] px-8 py-8 text-white relative">
          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold tracking-tight">{quiz.title || course?.title + ' Quiz'}</h1>
            <p className="text-[#CBD5E1] mt-2 font-medium">{quiz.description || 'Test your knowledge.'}</p>
            <div className="mt-8">
              <div className="flex justify-between text-sm font-bold mb-2 text-[#F8FAFC]">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span className="text-[#FF6B35]">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-[#FF6B35] h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-xl font-extrabold text-[#0F172A] mb-8 leading-relaxed">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-center p-5 border rounded-2xl cursor-pointer transition-all duration-200 ${selectedAnswer === option ? 'border-[#FF6B35] bg-[#FFE8DE] shadow-sm' : 'border-[#E2E8F0] hover:border-[#FF6B35]/50 hover:bg-[#F8FAFC]'}`}
              >
                <input 
                  type="radio" 
                  name={`question-${currentQuestion._id}`} 
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => handleSelectOption(currentQuestion._id, option)}
                  className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] border-[#CBD5E1] transition-all"
                />
                <span className={`ml-4 font-semibold ${selectedAnswer === option ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-12 flex justify-between items-center border-t border-[#E2E8F0] pt-6">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`px-8 py-3 rounded-xl font-bold transition-all ${currentQuestionIndex === 0 ? 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed' : 'bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] shadow-sm hover:-translate-y-0.5'}`}
            >
              Previous
            </button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-10 py-3 bg-[#FF6B35] text-white rounded-xl font-bold shadow-sm hover:bg-[#E85D2C] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 hover:-translate-y-0.5 flex items-center"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-10 py-3 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl font-bold shadow-sm hover:bg-[#F8FAFC] transition-all hover:-translate-y-0.5"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
