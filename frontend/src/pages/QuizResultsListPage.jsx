import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, XCircle, BookOpen, ClipboardList, ChevronRight,
  Calendar, Hash, Target, Loader2, X, AlertCircle
} from 'lucide-react';
import { getMyQuizAttempts, getAttemptById } from '../services/quizService';
import { ROUTES } from '../constants/routes';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const computeAttemptNumbers = (attempts) => {
  // Sort oldest first to assign numbers
  const sorted = [...attempts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const counts = {};
  const numbered = sorted.map(attempt => {
    const key = attempt.quizId?._id || attempt.quizId || attempt._id;
    counts[key] = (counts[key] || 0) + 1;
    return { ...attempt, calculatedAttemptNumber: counts[key] };
  });
  // Sort back to newest first
  return numbered.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
};

// ─── Question Card ────────────────────────────────────────────────────────────
const QuestionCard = ({ answer, index }) => {
  const isCorrect = answer.isCorrect;
  return (
    <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all ${isCorrect ? 'border-[#22C55E]/40' : 'border-[#EF4444]/40'}`}>
      <div className="flex items-start gap-3 mb-4">
         <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white ${isCorrect ? 'bg-[#22C55E]' : 'bg-[#EF4444] shadow-[0_2px_8px_rgba(239,68,68,0.4)]'}`}>
           {index + 1}
         </div>
         <p className="text-sm font-bold text-[#0F172A] leading-relaxed pt-1.5">
           {answer.questionText || `Question ${index + 1}`}
         </p>
      </div>

      <div className="space-y-3 pl-11">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Your Answer</p>
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isCorrect ? 'bg-[#F0FDF4] border-[#22C55E]/30 text-[#166534]' : 'bg-[#FEF2F2] border-[#EF4444]/30 text-[#991B1B]'}`}>
            {isCorrect ? <CheckCircle2 size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
            <span className="text-sm font-semibold">{answer.selectedAnswer || <span className="italic opacity-70">Not answered</span>}</span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Correct Answer</p>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]">
            <CheckCircle2 size={16} className="text-[#22C55E] shrink-0" />
            <span className="text-sm font-semibold">{answer.correctAnswer || '—'}</span>
          </div>
        </div>

        {answer.explanation && (
          <div className="mt-4 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0F172A] mb-1">Explanation</p>
            <p className="text-xs text-[#475569] font-medium leading-relaxed">{answer.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Details Panel Content ────────────────────────────────────────────────────
const DetailsPanelContent = ({ attemptId, attempts, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseAttempt = attempts.find(a => a._id === attemptId);

  useEffect(() => {
    if (!baseAttempt) return;
    if (baseAttempt.answers?.length && baseAttempt.answers[0]?.questionText) {
      setDetail(baseAttempt);
      return;
    }
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttemptById(attemptId);
        setDetail({ ...data.attempt, calculatedAttemptNumber: baseAttempt.calculatedAttemptNumber });
      } catch (err) {
        setError('Failed to load attempt details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [attemptId, baseAttempt]);

  if (!baseAttempt) return null;

  const courseTitle = baseAttempt.courseId?.title || 'Unknown Course';
  const quizTitle = baseAttempt.quizId?.title || 'Quiz';
  const score = baseAttempt.score ?? 0;
  const isPassed = baseAttempt.isPassed;
  const attemptNum = baseAttempt.calculatedAttemptNumber || 1;
  
  return (
    <div className="flex flex-col h-full bg-white lg:rounded-2xl lg:shadow-md lg:border lg:border-[#E2E8F0] overflow-hidden">
       {/* Header */}
       <div className="p-6 border-b border-white/10 relative shrink-0 bg-[#0F172A] text-white">
         {onClose && (
           <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors lg:hidden">
             <X size={20} />
           </button>
         )}
         <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] mb-2">{courseTitle}</p>
         <h2 className="text-2xl md:text-3xl font-extrabold mb-6 leading-tight pr-8">{quizTitle}</h2>
         
         <div className="flex items-center gap-6">
           <div>
             <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Score</p>
             <div className="flex items-end gap-1">
               <span className={`text-5xl font-black leading-none ${isPassed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{score}%</span>
             </div>
           </div>
           <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${isPassed ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'}`}>
             {isPassed ? 'Passed' : 'Failed'}
           </div>
         </div>
       </div>

       {/* Content */}
       <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAFC]">
         {/* Progress Summary */}
         {detail?.answers && (
           <div className="flex gap-3 mb-6">
             <div className="flex-1 bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-3 flex flex-col items-center justify-center">
               <span className="text-2xl font-black text-[#22C55E]">{detail.answers.filter(a=>a.isCorrect).length}</span>
               <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Correct</span>
             </div>
             <div className="flex-1 bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-3 flex flex-col items-center justify-center">
               <span className="text-2xl font-black text-[#EF4444]">{detail.answers.filter(a=>!a.isCorrect).length}</span>
               <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Wrong</span>
             </div>
             <div className="flex-1 bg-white border border-[#E2E8F0] shadow-sm rounded-xl p-3 flex flex-col items-center justify-center">
               <span className="text-2xl font-black text-[#0F172A]">{detail.answers.length}</span>
               <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Total</span>
             </div>
           </div>
         )}

         {/* Overview Stats */}
         <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] mb-8 shadow-sm flex flex-wrap gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Date Taken</p>
              <p className="text-sm font-bold text-[#0F172A]">{formatDate(baseAttempt.completedAt || baseAttempt.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">Attempt Number</p>
              <p className="text-sm font-bold text-[#0F172A]">#{attemptNum}</p>
            </div>
         </div>

         {/* Questions */}
         <div>
           <h3 className="text-sm font-extrabold text-[#0F172A] mb-4 uppercase tracking-wider">Question Breakdown</h3>
           {loading ? (
             <div className="flex flex-col items-center justify-center py-12">
               <Loader2 className="animate-spin text-[#FF6B35] mb-4" size={32} />
               <p className="text-sm font-medium text-[#64748B]">Loading detailed breakdown...</p>
             </div>
           ) : error ? (
             <div className="bg-[#FEF2F2] rounded-xl border border-[#FECACA] p-4 flex gap-3 text-[#EF4444]">
               <AlertCircle size={20} className="shrink-0" />
               <p className="text-sm font-semibold">{error}</p>
             </div>
           ) : detail?.answers ? (
             <div className="space-y-4">
               {detail.answers.map((answer, index) => (
                  <QuestionCard key={answer.questionId || index} answer={answer} index={index} />
               ))}
             </div>
           ) : (
             <p className="text-[#64748B] text-sm text-center p-8 bg-white rounded-xl border border-[#E2E8F0]">No answers available for this attempt.</p>
           )}
         </div>
       </div>
    </div>
  );
};

// ─── Horizontal Card ──────────────────────────────────────────────────────────
const HorizontalCard = ({ attempt, isSelected, onClick }) => {
  const courseTitle = attempt.courseId?.title || 'Unknown Course';
  const courseThumbnail = attempt.courseId?.thumbnail || null;
  const quizTitle = attempt.quizId?.title || 'Quiz';
  const score = attempt.score ?? 0;
  const isPassed = attempt.isPassed;
  const attemptNum = attempt.calculatedAttemptNumber || 1;
  const date = formatDate(attempt.completedAt || attempt.createdAt);

  return (
    <div 
      onClick={onClick}
      className={`group flex items-center bg-white rounded-2xl p-3 gap-4 transition-all cursor-pointer border-2 ${
        isSelected 
          ? 'border-[#FF6B35] shadow-[0_4px_12px_rgba(255,107,53,0.15)] bg-[#FFF9F6]' 
          : 'border-transparent border-b-[#E2E8F0] lg:border-[#E2E8F0] hover:border-[#FF6B35]/40 hover:shadow-md'
      }`}
    >
      {/* Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-[#F1F5F9] shrink-0 relative shadow-sm">
        {courseThumbnail ? (
          <img src={`/banner/${courseThumbnail}`} alt={courseTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#CBD5E1]">
            <BookOpen size={24} />
          </div>
        )}
        <div className="absolute top-1 left-1 bg-[#0F172A]/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          #{attemptNum}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35] mb-1 truncate">{courseTitle}</p>
        <h3 className="font-extrabold text-[#0F172A] text-sm md:text-base mb-1.5 truncate group-hover:text-[#FF6B35] transition-colors">{quizTitle}</h3>
        <p className="text-xs font-semibold text-[#94A3B8] flex items-center gap-1.5">
          <Calendar size={12} className="text-[#CBD5E1]" /> {date}
        </p>
      </div>
      
      {/* Score Circle & Status */}
      <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-16">
        <div className="relative w-12 h-12 flex items-center justify-center">
           <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
             <path
               className="text-[#E2E8F0]"
               strokeWidth="3.5"
               stroke="currentColor"
               fill="none"
               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
             />
             <path
               className={isPassed ? 'text-[#22C55E]' : 'text-[#EF4444]'}
               strokeDasharray={`${score}, 100`}
               strokeWidth="3.5"
               stroke="currentColor"
               fill="none"
               strokeLinecap="round"
               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
             />
           </svg>
           <span className={`absolute text-[10px] font-black ${isPassed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
             {score}%
           </span>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-wider mt-1.5 ${isPassed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {isPassed ? 'Passed' : 'Failed'}
        </span>
      </div>
      
      {/* Arrow */}
      <div className="shrink-0 text-[#CBD5E1] group-hover:text-[#FF6B35] transition-colors pr-2">
        <ChevronRight size={24} />
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const QuizResultsListPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortOrder, setSortOrder] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyQuizAttempts();
      const numbered = computeAttemptNumbers(data.attempts || []);
      setAttempts(numbered);
      
      // Select first attempt by default on desktop if available
      if (numbered.length > 0 && window.innerWidth >= 1024) {
         setSelectedAttemptId(numbered[0]._id);
      }
    } catch (err) {
      setError('Failed to load quiz results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  // Apply filter + sort
  const filtered = useMemo(() => {
    return attempts
      .filter(a => filterStatus === 'all' ? true : filterStatus === 'passed' ? a.isPassed : !a.isPassed)
      .sort((a, b) => {
        if (sortOrder === 'newest') return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
        if (sortOrder === 'oldest') return new Date(a.completedAt || a.createdAt) - new Date(b.completedAt || b.createdAt);
        if (sortOrder === 'score-high') return b.score - a.score;
        if (sortOrder === 'score-low') return a.score - b.score;
        return 0;
      });
  }, [attempts, filterStatus, sortOrder]);

  const passCount = attempts.filter(a => a.isPassed).length;
  const failCount = attempts.length - passCount;

  // Normalize score: old attempts may store score as a decimal (e.g. 0.9) instead of
  // a percentage integer (e.g. 90). If score is <= 1, treat it as a fraction × 100.
  const normalizeScore = (score) => {
    const n = Number(score);
    if (isNaN(n)) return 0;
    return n <= 1 && n >= 0 && n !== 0 ? Math.round(n * 100) : n;
  };

  const avgScore = attempts.length
    ? Math.round(
        attempts.reduce((sum, a) => sum + normalizeScore(a.score), 0) / attempts.length
      )
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Section 1: Header ── */}
      <div className="bg-[#0F172A] text-white py-12 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1E293B] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
                <Target size={28} className="text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">Quiz Results</h1>
            </div>
            <p className="text-[#94A3B8] text-base md:text-lg font-medium max-w-xl">
              Track your quiz performance and improvement across all courses.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md rotate-3 shadow-2xl">
            <ClipboardList size={80} className="text-[#FF6B35]" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* ── Section 2: Statistics Cards ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Total Attempts', value: attempts.length, icon: Hash, color: 'text-[#0F172A]' },
            { label: 'Passed', value: passCount, icon: CheckCircle2, color: 'text-[#22C55E]' },
            { label: 'Failed', value: failCount, icon: XCircle, color: 'text-[#EF4444]' },
            { label: 'Average Score', value: `${avgScore}%`, icon: Target, color: 'text-[#FF6B35]' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all group flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#F8FAFC] flex items-center justify-center border border-[#E2E8F0] group-hover:scale-110 group-hover:border-[#FF6B35]/30 transition-transform">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">{stat.label}</p>
                <p className={`text-2xl md:text-3xl font-black ${stat.color} leading-none`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#FF6B35]" size={40} /></div>
        ) : error ? (
           <div className="bg-white rounded-2xl border border-[#FECACA] p-8 text-center max-w-md mx-auto">
             <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4 text-[#EF4444]"><XCircle size={28} /></div>
             <h3 className="text-lg font-bold text-[#0F172A] mb-2">Something went wrong</h3>
             <p className="text-[#64748B] text-sm mb-6">{error}</p>
             <button onClick={fetchAttempts} className="px-6 py-2.5 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-[#1E293B]">Try Again</button>
           </div>
        ) : attempts.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto">
             <div className="w-32 h-32 bg-white rounded-full border-4 border-[#F1F5F9] flex items-center justify-center mb-8 shadow-sm">
               <ClipboardList size={56} className="text-[#CBD5E1]" />
             </div>
             <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-4">No quiz attempts yet</h2>
             <p className="text-[#64748B] font-medium mb-8 text-base">
               Take a quiz to start tracking your progress. Complete a course and attempt its final quiz to see your analytics here.
             </p>
             <Link
               to={ROUTES.COURSES}
               className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(255,107,53,0.4)] hover:bg-[#E85D2C] hover:-translate-y-1 transition-all"
             >
               <BookOpen size={20} />
               Browse Courses
             </Link>
           </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 relative">
            
            {/* Left Column: Attempts List */}
            <div className="w-full lg:w-5/12 flex flex-col gap-5">
              {/* Filters Toolbar */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2">
                <div className="flex gap-1.5 bg-white p-1.5 rounded-xl border border-[#E2E8F0] shadow-sm">
                  {[
                    { id: 'all', label: 'All', count: attempts.length },
                    { id: 'passed', label: 'Passed', count: passCount },
                    { id: 'failed', label: 'Failed', count: failCount }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilterStatus(f.id)}
                      className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                        filterStatus === f.id ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      {f.label}
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filterStatus === f.id ? 'bg-white/20' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                        {f.count}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="relative shrink-0">
                  <select
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-bold rounded-xl pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 cursor-pointer shadow-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="score-high">Highest Score</option>
                    <option value="score-low">Lowest Score</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {/* List */}
              {filtered.length === 0 ? (
                 <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center text-[#64748B] font-medium">
                   No attempts match the current filter.
                 </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map(attempt => (
                    <HorizontalCard 
                      key={attempt._id} 
                      attempt={attempt} 
                      isSelected={selectedAttemptId === attempt._id} 
                      onClick={() => setSelectedAttemptId(attempt._id)} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column / Mobile Drawer */}
            <div className={`
              fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex justify-end
              lg:static lg:block lg:w-7/12 lg:bg-transparent lg:z-auto
              ${selectedAttemptId ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'}
              transition-all duration-300
            `}>
              <div className={`
                w-full max-w-xl bg-transparent h-full pt-16 pb-0 pl-4 pr-0 md:p-8 lg:p-0 
                lg:h-auto lg:w-full lg:max-w-none transform transition-transform duration-300 flex justify-end
                ${selectedAttemptId ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}>
                <div className="w-full bg-white lg:bg-transparent lg:sticky lg:top-8 h-full lg:h-[calc(100vh-6rem)] rounded-tl-3xl md:rounded-3xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none flex flex-col relative border-l md:border border-[#E2E8F0] lg:border-none">
                  {selectedAttemptId ? (
                    <DetailsPanelContent attemptId={selectedAttemptId} attempts={attempts} onClose={() => setSelectedAttemptId(null)} />
                  ) : (
                    <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center h-full min-h-[500px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                      <div className="w-24 h-24 bg-[#F8FAFC] rounded-3xl flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                        <Target size={40} className="text-[#CBD5E1]" />
                      </div>
                      <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">Select an attempt</h3>
                      <p className="text-[#64748B] text-sm font-medium">Choose a quiz attempt from the list to view its detailed breakdown.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResultsListPage;
