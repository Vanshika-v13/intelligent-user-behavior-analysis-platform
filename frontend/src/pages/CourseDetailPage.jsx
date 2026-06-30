import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Clock, BookOpen, CheckCircle2, PlayCircle, AlertCircle,
  FileText, Lock, ChevronRight, X, Award
} from 'lucide-react';
import { courseService } from '../services/courseService';
import { progressService } from '../services/progressService';
import { analyticsService } from '../services/analyticsService';
import FooterSection from '../components/landing/FooterSection';
import { useAuth } from '../context/AuthContext';

// ─── YouTube IFrame API helpers ───────────────────────────────────────────────
/**
 * Extract the 11-character YouTube video ID from any YouTube URL format.
 * Handles: watch?v=, youtu.be/, /embed/, /shorts/, and playlist URLs.
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /[?&]v=([^&#]{11})/,
    /youtu\.be\/([^?&#]{11})/,
    /\/embed\/([^?&#]{11})/,
    /\/shorts\/([^?&#]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Load the YouTube IFrame Player API script exactly once per page load.
 * Returns a promise that resolves when the API is ready.
 */
let ytApiReadyPromise = null;
function loadYouTubeApi() {
  if (ytApiReadyPromise) return ytApiReadyPromise;
  ytApiReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    // Create the script tag
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    // YouTube calls this global when ready
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
  return ytApiReadyPromise;
}
// ─────────────────────────────────────────────────────────────────────────────

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // ── Video player state ──────────────────────────────────────────────────────
  const [activeLesson, setActiveLesson] = useState(null);   // lesson object currently in player
  const [playerReady, setPlayerReady] = useState(false);    // IFrame API loaded?
  const [lessonStartedSet] = useState(() => new Set());     // track which lessons fired "started"
  const playerRef = useRef(null);        // YT.Player instance
  const playerContainerRef = useRef(null); // DOM div the player mounts into
  const lessonStartTime = useRef(null);  // Date.now() when video started playing
  // ─────────────────────────────────────────────────────────────────────────────

  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // ── Load course + progress ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      setError(null);
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data.course || data);
        try {
          const prog = await progressService.getProgress(id);
          if (prog && Array.isArray(prog.completedLessons)) {
            setProgress(prog.completedLessons);
            setProgressPercentage(prog.progressPercentage || 0);
          }
        } catch {
          console.log('No progress found or error fetching progress.');
        }
      } catch {
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
    window.scrollTo(0, 0);
  }, [id, isAuthenticated]);

  // ── Load YouTube IFrame API once ────────────────────────────────────────────
  useEffect(() => {
    loadYouTubeApi().then(() => setPlayerReady(true));
  }, []);

  // ── Helper: compute updated progress percentage ─────────────────────────────
  const computePercentage = useCallback((newProgress, totalLessons) => {
    if (!totalLessons) return 0;
    return Math.min(100, Math.round((newProgress.length / totalLessons) * 100));
  }, []);

  // ── Core: mark a lesson completed (from API event OR manual click) ──────────
  const markLessonComplete = useCallback(async (lesson, source = 'video_ended') => {
    const lessonKey = lesson._id || lesson.title;
    // Prevent double-marking
    if (progress.includes(lessonKey)) return;

    try {
      // Calculate time spent (seconds). lessonStartTime may be null if ENDED fired without PLAYING.
      const timeSpent = lessonStartTime.current
        ? Math.round((Date.now() - lessonStartTime.current) / 1000)
        : null;

      // Save to backend progress collection (no schema change — uses existing endpoint)
      await progressService.saveProgress(id, lessonKey, { source });

      // Update local state optimistically
      const newProgress = [...progress, lessonKey];
      const totalLessons = course?.lessons?.length || 0;
      const newPct = computePercentage(newProgress, totalLessons);
      setProgress(newProgress);
      setProgressPercentage(newPct);

      // ── Analytics events (via existing analyticsService — no new schema) ─────
      const eventName = source === 'manual' ? 'lesson_marked_complete' : 'lesson_completed';
      await analyticsService.trackEvent(eventName, {
        courseId: id,
        lessonId: lessonKey,
        lessonTitle: lesson.title,
        source,
        ...(timeSpent !== null ? { timeSpentSeconds: timeSpent } : {}),
      });

      await analyticsService.trackEvent('course_completion_percentage', {
        courseId: id,
        completionPercentage: newPct,
        completedLessons: newProgress.length,
        totalLessons,
      });

      if (timeSpent !== null) {
        await analyticsService.trackEvent('time_spent_learning', {
          courseId: id,
          lessonId: lessonKey,
          timeSpentSeconds: timeSpent,
        });
      }
    } catch (err) {
      console.error('Failed to save progress or track analytics:', err);
    }
  }, [progress, course, id, computePercentage]);

  // ── Mount / update the YT.Player when activeLesson changes ─────────────────
  useEffect(() => {
    if (!playerReady || !activeLesson) return;

    const videoId = extractYouTubeId(activeLesson.youtubeUrl);
    if (!videoId) return;

    // Destroy previous player instance
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }

    // The container div must exist in the DOM at this point
    if (!playerContainerRef.current) return;

    // Reset start-time for this lesson session
    lessonStartTime.current = null;
    const lessonStartedThisSession = false; // local closure flag

    let startedThisSession = false;

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      videoId,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
      },
      events: {
        onStateChange: async (event) => {
          const state = event.data;

          // PLAYING (1) — fire lesson_started once per lesson session
          if (state === window.YT.PlayerState.PLAYING) {
            if (!startedThisSession) {
              startedThisSession = true;
              lessonStartTime.current = Date.now();
              // Only fire analytics if not already started for this lesson
              if (!lessonStartedSet.has(activeLesson._id || activeLesson.title)) {
                lessonStartedSet.add(activeLesson._id || activeLesson.title);
                try {
                  await analyticsService.trackEvent('lesson_started', {
                    courseId: id,
                    lessonId: activeLesson._id || activeLesson.title,
                    lessonTitle: activeLesson.title,
                  });
                } catch {}
              }
            }
          }

          // ENDED (0) — mark complete automatically
          if (state === window.YT.PlayerState.ENDED) {
            await markLessonComplete(activeLesson, 'video_ended');
          }
        },
      },
    });

    // Scroll the player into view smoothly
    setTimeout(() => {
      playerContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    return () => {
      // Cleanup on lesson change or unmount
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson, playerReady]);

  // ── Handle Watch Video click ────────────────────────────────────────────────
  const handleWatchVideo = useCallback((lesson) => {
    setActiveLesson(lesson);
    // Note: lesson_started analytics fires inside the YT.PlayerState.PLAYING handler
    // Progress is NOT saved here — only on ENDED or manual mark
  }, []);

  // ── Handle manual Mark as Completed ────────────────────────────────────────
  const handleMarkComplete = useCallback(async (lesson) => {
    await markLessonComplete(lesson, 'manual');
  }, [markLessonComplete]);

  // ── Close player ────────────────────────────────────────────────────────────
  const handleClosePlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }
    setActiveLesson(null);
    lessonStartTime.current = null;
  }, []);

  // ── Loading / error states ──────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)] items-center justify-center">
        <div className="animate-pulse w-16 h-16 bg-orange-200 rounded-full"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-background)] items-center justify-center p-8">
        <div className="flex flex-col items-center justify-center p-12 bg-red-50 text-red-600 rounded-[28px] max-w-2xl w-full border border-red-100 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
          <h3 className="text-2xl font-bold mb-2">Course Not Found</h3>
          <p className="mb-8 text-red-700/80">{error || "The course you're looking for doesn't exist."}</p>
          <Link to="/courses" className="bg-red-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-red-700 transition-colors shadow-sm">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.lessons ? course.lessons.length : 0;
  const completedCount = progress.length;

  // Progress bar (10 blocks)
  const filledBlocks = Math.round((progressPercentage / 100) * 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] animate-[fadeIn_0.5s_ease-out]">

      {/* ── Course Hero Banner ─────────────────────────────────────────────── */}
      <section className="w-full bg-[#FAFAFA] border-b border-stone-200/80 pt-16 pb-16 lg:py-20 flex flex-col justify-center">
        <div className="max-w-[1280px] w-full mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-center">

            {/* Left: course metadata */}
            <div className="w-full md:w-[55%] flex flex-col items-start text-left">
              <div className="mb-5">
                <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-[14px] font-bold rounded-full border border-orange-200 shadow-sm uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-primary-text)] tracking-tight mb-6 leading-[1.1] max-w-[700px]">
                {course.title}
              </h1>
              <p className="text-[17px] md:text-[19px] text-[var(--color-secondary-text)] mb-8 line-clamp-3 leading-relaxed max-w-[650px]">
                {course.description}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-5 text-[15px] text-stone-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={16} className="text-orange-500" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} className="text-orange-500" />
                  {course.duration >= 60
                    ? `${Math.floor(course.duration / 60)}h ${course.duration % 60 > 0 ? `${course.duration % 60}m` : ''}`.trim()
                    : `${course.duration} mins`}
                </span>
                {completedCount > 0 && (
                  <span className="flex items-center gap-1.5 text-green-600">
                    <Award size={16} />
                    {progressPercentage}% complete
                  </span>
                )}
              </div>
            </div>

            {/* Right: banner image */}
            <div className="w-full md:w-[45%]">
              <div className="w-full aspect-video md:aspect-[4/3] rounded-[32px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-stone-200/50 group bg-stone-100 flex items-center justify-center relative">
                {(() => {
                  const resolveThumbnail = (raw) => {
                    if (!raw) return null;
                    if (raw.startsWith('http://') || raw.startsWith('https://')) {
                      if (raw.includes('placeholder.com') || raw.includes('via.placeholder')) {
                        return '/banner/html_css.jpg';
                      }
                      return raw;
                    }
                    const filename = raw.replace(/^\/banner\//, '');
                    return `/banner/${filename}`;
                  };
                  const bannerSrc = resolveThumbnail(course.thumbnail || course.image || course.banner) || '/banner/html_css.jpg';
                  return (
                    <img
                      src={bannerSrc}
                      alt={course.title}
                      onError={(e) => { e.currentTarget.src = '/banner/html_css.jpg'; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <section className="w-full py-16 lg:py-24 flex-grow bg-white">
        <div className="max-w-[900px] w-full mx-auto px-5 md:px-8">

          {/* ── Progress Section ─────────────────────────────────────────── */}
          <div className="mb-12 p-8 bg-stone-50 rounded-[32px] border border-stone-200 shadow-sm">
            <h3 className="text-xl font-bold text-[var(--color-primary-text)] mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-orange-500" /> Course Progress
            </h3>
            <div className="text-[20px] tracking-[0.2em] font-mono text-orange-500 mb-2">
              {progressBar} {progressPercentage}%
            </div>
            <p className="text-[15px] font-medium text-stone-600">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>

          {/* ── Embedded Video Player ────────────────────────────────────── */}
          {activeLesson && (
            <div
              id="video-player-section"
              className="mb-12 rounded-[32px] overflow-hidden border border-stone-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)] bg-stone-950 animate-[playerSlideIn_0.35s_ease-out]"
            >
              {/* Player header */}
              <div className="flex items-center justify-between px-5 py-4 bg-stone-900 border-b border-stone-700">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0 animate-pulse" />
                  <span className="text-white text-[14px] font-semibold truncate">
                    Now Playing: {activeLesson.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {/* Manual completion button */}
                  {!progress.includes(activeLesson._id || activeLesson.title) && (
                    <button
                      id="mark-complete-btn"
                      onClick={() => handleMarkComplete(activeLesson)}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      <CheckCircle2 size={15} />
                      Mark as Completed
                    </button>
                  )}
                  {progress.includes(activeLesson._id || activeLesson.title) && (
                    <span className="flex items-center gap-1.5 text-green-400 text-[13px] font-semibold px-3">
                      <CheckCircle2 size={15} /> Completed
                    </span>
                  )}
                  {/* Close player */}
                  <button
                    id="close-player-btn"
                    onClick={handleClosePlayer}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                    aria-label="Close player"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* YouTube iframe container — YT.Player mounts here */}
              <div className="w-full aspect-video">
                <div ref={playerContainerRef} className="w-full h-full" id="yt-player-mount" />
              </div>

              {/* Lesson navigation below player */}
              {course.lessons && course.lessons.length > 1 && (() => {
                const currentIdx = course.lessons.findIndex(
                  l => (l._id || l.title) === (activeLesson._id || activeLesson.title)
                );
                const nextLesson = course.lessons[currentIdx + 1];
                return nextLesson ? (
                  <div className="flex items-center justify-between px-5 py-4 bg-stone-900 border-t border-stone-700">
                    <span className="text-stone-400 text-[13px]">
                      Lesson {currentIdx + 1} of {course.lessons.length}
                    </span>
                    <button
                      id="next-lesson-btn"
                      onClick={() => handleWatchVideo(nextLesson)}
                      className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-[13px] font-semibold transition-colors"
                    >
                      Next: {nextLesson.title} <ChevronRight size={16} />
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* ── Lessons Section ──────────────────────────────────────────── */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">
              Lessons
            </h2>
            <div className="flex flex-col gap-4">
              {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, idx) => {
                  const lessonKey = lesson._id || lesson.title;
                  const isCompleted = progress.includes(lessonKey);
                  const isActive = activeLesson && (activeLesson._id || activeLesson.title) === lessonKey;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border rounded-[20px] transition-all shadow-sm ${
                        isActive
                          ? 'bg-orange-50 border-orange-300 shadow-orange-100'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 size={22} className="text-green-500" />
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full border-2 border-orange-400 bg-orange-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                          )}
                        </div>
                        <div>
                          <p className={`text-[16px] font-bold mb-1 ${isActive ? 'text-orange-700' : 'text-[var(--color-primary-text)]'}`}>
                            {idx + 1}. {lesson.title}
                            {isActive && (
                              <span className="ml-2 text-[11px] font-semibold bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full align-middle">
                                Now Playing
                              </span>
                            )}
                          </p>
                          {lesson.duration && (
                            <span className="text-[14px] text-stone-500 flex items-center gap-1.5">
                              <Clock size={14} /> {lesson.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.youtubeUrl ? (
                          <>
                            <button
                              id={`watch-lesson-${idx + 1}`}
                              onClick={() => handleWatchVideo(lesson)}
                              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-colors ${
                                isActive
                                  ? 'bg-orange-500 text-white border border-orange-500 hover:bg-orange-600'
                                  : 'bg-orange-100 text-orange-600 border border-orange-200 hover:bg-orange-200'
                              }`}
                            >
                              <PlayCircle size={16} />
                              {isActive ? 'Watching' : 'Watch Video'}
                            </button>
                            {/* Manual mark-complete in lesson row (for already-watched lessons) */}
                            {!isCompleted && !isActive && (
                              <button
                                id={`mark-complete-lesson-${idx + 1}`}
                                onClick={() => handleMarkComplete(lesson)}
                                title="Mark as Completed"
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 hover:bg-green-100 hover:border-green-300 text-stone-400 hover:text-green-600 transition-colors"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            disabled
                            className="flex items-center justify-center gap-2 bg-stone-100 text-stone-400 border border-stone-200 px-5 py-2.5 rounded-xl text-[14px] font-semibold cursor-not-allowed"
                          >
                            <Lock size={16} />
                            Video Coming Soon
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-stone-500">No lessons available.</p>
              )}
            </div>
          </div>

          {/* ── Notes Section ────────────────────────────────────────────── */}
          <div>
            <h2 className="text-3xl font-bold text-[var(--color-primary-text)] tracking-tight mb-6">
              Notes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.notes && course.notes.length > 0 ? (
                course.notes.map((note, idx) => (
                  <a
                    key={idx}
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-[20px] hover:border-orange-200 transition-colors shadow-sm cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <FileText className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-bold text-[var(--color-primary-text)] mb-1">
                        {note.title}
                      </h4>
                      <span className="text-[13px] text-stone-500 font-medium group-hover:text-orange-500 transition-colors">
                        Download PDF
                      </span>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-stone-500">No notes available.</p>
              )}
            </div>
          </div>

        </div>
      </section>

      <FooterSection />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes playerSlideIn {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default CourseDetailPage;
