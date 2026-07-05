import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseQuizResult } from '../services/quizService';
import { ROUTES } from '../constants/routes';
import { CheckCircle2, XCircle, RotateCcw, Home, BookOpen, Award, Download } from 'lucide-react';
import { generateCertificate } from '../services/certificateService';
import analyticsService from '../services/analytics/analyticsV1Service';

const QuizResultPage = () => {
  const { id: courseId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [certLoading, setCertLoading] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getCourseQuizResult(courseId);
        setResult(data.attempt);
        
        if (data.attempt?.isPassed) {
          setCertLoading(true);
          try {
            const certRes = await generateCertificate(courseId);
            if (certRes.success && certRes.certificate) {
              setCertificate(certRes.certificate);
              analyticsService.trackEvent('CERTIFICATE_GENERATED', { 
                page: '/course/quiz-result',
                metadata: { courseId, certificateId: certRes.certificate.certificateId }
              }).catch(console.error);
            }
          } catch (certErr) {
            console.error('Certificate generation failed or not eligible:', certErr);
          } finally {
            setCertLoading(false);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('No quiz attempt found for this course.');
        setLoading(false);
      }
    };
    fetchResult();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-pulse h-96"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#E2E8F0] text-center max-w-md animate-[fadeIn_0.5s_ease-out]">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6 text-[#94A3B8]">
            <XCircle size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mb-2">Results Not Found</h2>
          <p className="text-[#64748B] font-medium mb-8">{error}</p>
          <Link 
            to={ROUTES.COURSE_DETAIL_PATH(courseId)} 
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0F172A] text-white rounded-xl font-bold shadow-sm hover:bg-[#1E293B] hover:-translate-y-0.5 transition-all w-full"
          >
            <BookOpen size={18} /> Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { score, isPassed, answers } = result;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const wrongCount = answers.length - correctCount;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-[#E2E8F0] overflow-hidden animate-[fadeIn_0.5s_ease-out]">
        
        {/* Header */}
        <div className={`px-8 py-12 text-center relative overflow-hidden ${isPassed ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'}`}>
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-sm ring-4 ring-white ${isPassed ? 'bg-[#DCFCE7] text-[#22C55E]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
            {isPassed ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
          </div>
          <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${isPassed ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
            {isPassed ? 'Congratulations! You Passed' : 'Quiz Failed. Keep Trying!'}
          </h1>
          <div className="mt-4 inline-flex items-center justify-center bg-white rounded-xl px-6 py-3 shadow-sm border border-[#E2E8F0]">
            <span className="text-4xl font-extrabold text-[#0F172A]">{score}%</span>
            <span className="text-[#64748B] font-bold uppercase text-xs tracking-widest ml-3 mt-2">Score</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0]">
              <span className="block text-4xl font-extrabold text-[#22C55E] mb-2">{correctCount}</span>
              <span className="text-[#64748B] font-bold text-xs uppercase tracking-wider">Correct</span>
            </div>
            <div className="bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0]">
              <span className="block text-4xl font-extrabold text-[#EF4444] mb-2">{wrongCount}</span>
              <span className="text-[#64748B] font-bold text-xs uppercase tracking-wider">Wrong</span>
            </div>
          </div>

          {/* Certificate Unlocked Section */}
          {isPassed && (certLoading || certificate) && (
            <div className="mb-10 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 border border-[#FF6B35]/20 rounded-2xl p-6 text-center animate-[fadeIn_0.5s_ease-out]">
              {certLoading ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#0F172A] font-semibold">Generating your certificate...</p>
                </div>
              ) : (
                certificate && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-lg mb-4">
                      <Award size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">🎉 Certificate Unlocked!</h3>
                    <p className="text-[#64748B] mb-6">You have completed this course.</p>
                    <Link 
                      to="/dashboard/certificates" 
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] hover:bg-[#1E293B] transition-all"
                    >
                      <Download size={18} /> View Certificate
                    </Link>
                  </div>
                )
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!isPassed && (
              <Link 
                to={ROUTES.COURSE_DETAIL_PATH(courseId) + '/quiz'}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF6B35] text-white rounded-xl font-bold shadow-sm hover:bg-[#E85D2C] hover:-translate-y-0.5 transition-all text-center w-full sm:w-auto"
              >
                <RotateCcw size={18} /> Retake Quiz
              </Link>
            )}
            <Link 
              to={ROUTES.COURSE_DETAIL_PATH(courseId)}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#0F172A] border border-[#E2E8F0] rounded-xl font-bold shadow-sm hover:bg-[#F8FAFC] hover:-translate-y-0.5 transition-all text-center w-full sm:w-auto"
            >
              <BookOpen size={18} /> Back to Course
            </Link>
            {isPassed && (
              <Link 
                to={ROUTES.DASHBOARD}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF6B35] text-white rounded-xl font-bold shadow-sm hover:bg-[#E85D2C] hover:-translate-y-0.5 transition-all text-center w-full sm:w-auto"
              >
                <Home size={18} /> Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
