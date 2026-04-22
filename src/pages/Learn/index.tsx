import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetCourseByIdQuery } from '../../store/services/coursesApi'
import { useGetLessonsByCourseIdQuery } from '../../store/services/lessonsApi'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { markLessonComplete } from '../../store/slices/enrollmentSlice'
import { addToast } from '../../store/slices/uiSlice'
import Skeleton from '../../components/ui/Skeleton'

function ProgressRing({ pct, size = 48 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={4} className="text-slate-200 dark:text-slate-700" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        className="text-primary-500 transition-all duration-500" strokeLinecap="round" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="rotate-90 fill-slate-700 dark:fill-slate-300 text-[10px] font-bold" style={{ transform: `rotate(90deg) translate(0,0)` }}>
        {pct}%
      </text>
    </svg>
  )
}

function Confetti({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: ['#4f46e5', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'][i % 6],
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${0.5 + Math.random() * 1}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function Learn() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { data: course } = useGetCourseByIdQuery(courseId ?? '')
  const { data: lessons = [], isLoading } = useGetLessonsByCourseIdQuery(courseId ?? '')

  const enrollment = useAppSelector(s => s.enrollment.enrolledCourses[courseId ?? ''])
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated)

  const [notes, setNotes] = useState<Record<string, string>>({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  const currentLesson = lessons.find(l => l.id === lessonId) ?? lessons[0]
  const completedSet = new Set(enrollment?.completedLessons ?? [])
  const progress = enrollment?.progress ?? 0

  // Redirect if not enrolled
  useEffect(() => {
    if (!isAuthenticated) { navigate('/auth/login'); return }
  }, [isAuthenticated, navigate])

  function handleMarkComplete() {
    if (!currentLesson || !courseId) return
    if (completedSet.has(currentLesson.id)) return

    dispatch(markLessonComplete({ courseId, lessonId: currentLesson.id, totalLessons: lessons.length }))

    const newPct = Math.round(((completedSet.size + 1) / lessons.length) * 100)
    if (newPct === 100) {
      setShowConfetti(true)
      dispatch(addToast({ type: 'success', message: '🎉 تهانينا! أتممت الكورس بنجاح!' }))
      setTimeout(() => setShowConfetti(false), 4000)
    } else {
      dispatch(addToast({ type: 'success', message: 'تم تحديد الدرس كمكتمل ✓' }))
    }

    // Auto-advance to next lesson
    const idx = lessons.findIndex(l => l.id === currentLesson.id)
    if (idx < lessons.length - 1) {
      setTimeout(() => navigate(`/learn/${courseId}/${lessons[idx + 1].id}`), 800)
    }
  }

  if (isLoading || !course) {
    return <div className="p-8"><Skeleton variant="thumbnail" /></div>
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-900">
      <Confetti show={showConfetti} />

      {/* ── VIDEO AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <Link to={`/courses/${courseId}`} className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {course.title}
          </Link>
          <div className="mr-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <ProgressRing pct={progress} size={32} />
              <span>{progress}%</span>
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="flex-1 bg-black overflow-hidden">
          {currentLesson ? (
            <iframe
              key={currentLesson.id}
              src={currentLesson.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={currentLesson.title}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">اختر درساً من القائمة</div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-bold text-sm">{currentLesson?.title}</h2>
            <p className="text-slate-400 text-xs">{currentLesson?.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => {
                const idx = lessons.findIndex(l => l.id === currentLesson?.id)
                if (idx > 0) navigate(`/learn/${courseId}/${lessons[idx - 1].id}`)
              }}
              disabled={!currentLesson || lessons.indexOf(currentLesson) === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 text-xs font-medium transition-colors"
            >
              ← السابق
            </button>
            {/* Mark complete */}
            {currentLesson && !completedSet.has(currentLesson.id) ? (
              <button onClick={handleMarkComplete}
                className="px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors">
                ✓ تحديد كمكتمل
              </button>
            ) : (
              <span className="px-4 py-1.5 rounded-lg bg-green-700/30 text-green-400 text-xs font-bold flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                مكتمل
              </span>
            )}
            {/* Next */}
            <button
              onClick={() => {
                const idx = lessons.findIndex(l => l.id === currentLesson?.id)
                if (idx < lessons.length - 1) navigate(`/learn/${courseId}/${lessons[idx + 1].id}`)
              }}
              disabled={!currentLesson || lessons.indexOf(currentLesson) === lessons.length - 1}
              className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 text-xs font-medium transition-colors"
            >
              التالي →
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-3">
          <p className="text-xs font-bold text-slate-400 mb-1.5">ملاحظاتي للدرس الحالي</p>
          <textarea
            value={currentLesson ? (notes[currentLesson.id] ?? '') : ''}
            onChange={e => currentLesson && setNotes(prev => ({ ...prev, [currentLesson.id]: e.target.value }))}
            rows={2}
            placeholder="اكتب ملاحظاتك هنا..."
            className="w-full bg-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 resize-none outline-none placeholder-slate-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-bold text-sm">محتوى الكورس</h3>
            <p className="text-slate-400 text-xs mt-0.5">{completedSet.size} / {lessons.length} درس مكتمل</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson, idx) => {
              const isCompleted = completedSet.has(lesson.id)
              const isCurrent = lesson.id === currentLesson?.id
              return (
                <button
                  key={lesson.id}
                  onClick={() => navigate(`/learn/${courseId}/${lesson.id}`)}
                  className={`w-full text-start flex items-start gap-3 px-4 py-3 border-b border-slate-700/50 transition-colors ${
                    isCurrent ? 'bg-primary-900/40 border-r-2 border-r-primary-500' : 'hover:bg-slate-700/50'
                  }`}
                >
                  {/* Status icon */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                    isCompleted ? 'bg-green-600 text-white' : isCurrent ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrent ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium leading-snug line-clamp-2 ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                      {lesson.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{lesson.duration}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
