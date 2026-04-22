import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetCourseByIdQuery } from '../../store/services/coursesApi'
import { useGetLessonsByCourseIdQuery } from '../../store/services/lessonsApi'
import { useGetReviewsByCourseIdQuery } from '../../store/services/reviewsApi'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { enroll } from '../../store/slices/enrollmentSlice'
import { toggleWishlist } from '../../store/slices/wishlistSlice'
import { addToast } from '../../store/slices/uiSlice'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import Modal from '../../components/ui/Modal'
import type { CourseLevel } from '../../types'

const levelAr: Record<CourseLevel, string> = {
  beginner: 'مبتدئ',
  intermediate: 'متوسط',
  advanced: 'متقدم',
}

const levelVariant: Record<CourseLevel, 'beginner' | 'intermediate' | 'advanced'> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
}

function StarRow({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`${s} ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

function RatingBar({ stars, total }: { stars: number; total: number }) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map(s => {
        const pct = s === 5 ? 68 : s === 4 ? 22 : s === 3 ? 6 : s === 2 ? 2 : 2
        return (
          <div key={s} className="flex items-center gap-2 text-sm">
            <span className="w-4 text-slate-500 dark:text-slate-400 text-left">{s}</span>
            <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-left text-slate-500 dark:text-slate-400 text-xs">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

export default function CourseDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(id ?? '')
  const { data: lessons = [], isLoading: lessonsLoading } = useGetLessonsByCourseIdQuery(id ?? '')
  const { data: reviews = [] } = useGetReviewsByCourseIdQuery(id ?? '')

  const isEnrolled = useAppSelector(s => !!s.enrollment.enrolledCourses[id ?? ''])
  const isWishlisted = useAppSelector(s => s.wishlist.items.includes(id ?? ''))
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated)

  const [openLesson, setOpenLesson] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  function handleEnroll() {
    if (!isAuthenticated) { navigate('/auth/login'); return }
    dispatch(enroll(id!))
    dispatch(addToast({ type: 'success', message: 'تم التسجيل في الكورس بنجاح! 🎉' }))
    navigate(`/learn/${id}/${lessons[0]?.id ?? ''}`)
  }

  function handleWishlist() {
    if (!isAuthenticated) { navigate('/auth/login'); return }
    dispatch(toggleWishlist(id!))
    dispatch(addToast({
      type: 'info',
      message: isWishlisted ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة إلى المفضلة ❤️',
    }))
  }

  if (courseLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="thumbnail" />
        <Skeleton variant="text" lines={4} />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">الكورس غير موجود</h2>
          <Link to="/courses" className="text-primary-600 dark:text-primary-400 hover:underline">العودة للكورسات</Link>
        </div>
      </div>
    )
  }

  const discount = Math.round((1 - course.price / course.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── HERO BANNER ── */}
      <div className="bg-gradient-to-l from-slate-900 via-primary-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'الكورسات', href: '/courses' },
              { label: course.category, href: `/courses?category=${encodeURIComponent(course.category)}` },
              { label: course.title },
            ]} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left: course info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant={levelVariant[course.level]}>{levelAr[course.level]}</Badge>
                <Badge variant="primary">{course.category}</Badge>
                {discount > 0 && (
                  <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    خصم {discount}%
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black leading-tight">{course.title}</h1>
              <p className="text-slate-300 text-lg leading-relaxed">{course.description}</p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 font-bold text-base">{course.rating}</span>
                  <StarRow rating={course.rating} />
                  <span className="text-slate-400">({course.reviewCount.toLocaleString()} تقييم)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{course.enrolled.toLocaleString()} طالب</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{course.totalDuration}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{course.totalLessons} درس</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{course.language}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 pt-2">
                <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`} name={course.instructorName} size="md" />
                <div>
                  <p className="text-xs text-slate-400">المدرب</p>
                  <p className="font-semibold text-primary-300 hover:text-primary-200 cursor-pointer">{course.instructorName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400">آخر تحديث: {course.lastUpdated}</p>
            </div>

            {/* Right: preview card (desktop) — hidden on mobile, shown as sidebar below */}
            <div className="hidden lg:block">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 sticky top-24">
                {/* Thumbnail with play button */}
                <div className="relative aspect-video bg-slate-900 cursor-pointer group" onClick={() => setPreviewOpen(true)}>
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-70 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-primary-600 mr-[-3px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-medium">
                    معاينة الكورس
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Price */}
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-lg text-slate-400 line-through mb-0.5">${course.originalPrice}</span>
                    )}
                    {discount > 0 && (
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full mb-1">
                        وفّر {discount}%
                      </span>
                    )}
                  </div>

                  {/* Enroll / Continue */}
                  {isEnrolled ? (
                    <button
                      onClick={() => navigate(`/learn/${id}/${lessons[0]?.id ?? ''}`)}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors text-base"
                    >
                      متابعة التعلم ←
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="w-full py-3 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-primary-500/30 text-base"
                    >
                      سجّل الآن
                    </button>
                  )}

                  {/* Wishlist + Share */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleWishlist}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-sm font-medium transition-colors ${
                        isWishlisted
                          ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <svg className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {isWishlisted ? 'في المفضلة' : 'المفضلة'}
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      مشاركة
                    </button>
                  </div>

                  {/* Course includes */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="font-bold text-slate-900 dark:text-white mb-3">يشمل الكورس:</p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      {[
                        { icon: '🎬', text: `${course.totalDuration} من محتوى الفيديو` },
                        { icon: '📖', text: `${course.totalLessons} درس تفاعلي` },
                        { icon: '📱', text: 'وصول من الجوال والكمبيوتر' },
                        { icon: '♾️', text: 'وصول مدى الحياة' },
                        { icon: '🏆', text: 'شهادة إتمام معتمدة' },
                      ].map(item => (
                        <li key={item.text} className="flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* What you'll learn */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary-600 rounded-full inline-block" />
                ماذا ستتعلم في هذا الكورس؟
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'بناء مشاريع حقيقية قابلة للنشر',
                  'إتقان أحدث الأدوات والتقنيات',
                  'كتابة كود نظيف وقابل للصيانة',
                  'التعامل مع حالات الإنتاج الحقيقية',
                  'تطبيق أفضل الممارسات والمعايير',
                  'الاستعداد للمقابلات التقنية',
                  'فهم الأساسيات والمفاهيم العميقة',
                  'بناء محفظة أعمال احترافية',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent-500 rounded-full inline-block" />
                المتطلبات الأساسية
              </h2>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {[
                  'معرفة أساسية بـ HTML و CSS',
                  'جهاز كمبيوتر يعمل بنظام Windows أو Mac أو Linux',
                  'اتصال بالإنترنت لتحميل الأدوات',
                  'لا يحتاج خبرة سابقة بالمكتبات',
                ].map(req => (
                  <li key={req} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {/* Curriculum */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded-full inline-block" />
                  المنهج الدراسي
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">{lessons.length} درس · {course.totalDuration}</span>
              </div>

              {lessonsLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="text" lines={1} />)}</div>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => {
                    const isOpen = openLesson === lesson.id
                    return (
                      <div key={lesson.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenLesson(isOpen ? null : lesson.id)}
                          className="w-full flex items-center gap-3 p-4 text-start hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          {/* Index or lock */}
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                            lesson.isFree
                              ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                          }`}>
                            {lesson.isFree ? (
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              idx + 1
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{lesson.title}</span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {lesson.isFree && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">مجاني</span>
                            )}
                            <span className="text-xs text-slate-400">{lesson.duration}</span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                            {lesson.isFree || isEnrolled ? (
                              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                <iframe
                                  src={lesson.videoUrl}
                                  className="w-full h-full"
                                  allowFullScreen
                                  title={lesson.title}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-6 gap-3 text-slate-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-sm">سجّل في الكورس لمشاهدة هذا الدرس</p>
                                <button onClick={handleEnroll} className="text-xs bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                                  سجّل الآن
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-500 rounded-full inline-block" />
                تقييمات الطلاب
              </h2>

              {/* Summary */}
              <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                <div className="flex flex-col items-center justify-center gap-1 min-w-[120px]">
                  <span className="text-6xl font-black text-yellow-500">{course.rating}</span>
                  <StarRow rating={course.rating} size="lg" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">تقييم الكورس</span>
                </div>
                <div className="flex-1">
                  <RatingBar stars={5} total={course.reviewCount} />
                </div>
              </div>

              {/* Review cards */}
              {reviews.length === 0 ? (
                <p className="text-slate-400 text-center py-4">لا توجد تقييمات بعد</p>
              ) : (
                <div className="space-y-5">
                  {reviews.map(review => (
                    <div key={review.id} className="flex gap-4">
                      <Avatar src={review.userAvatar} name={review.userName} size="sm" className="flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">{review.userName}</span>
                          <StarRow rating={review.rating} size="sm" />
                          <span className="text-xs text-slate-400">{review.createdAt}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.comment}</p>
                        <button className="mt-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          مفيد ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Instructor card */}
            <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent-500 rounded-full inline-block" />
                عن المدرب
              </h2>
              <div className="flex flex-col sm:flex-row gap-5">
                <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`} name={course.instructorName} size="xl" className="flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">{course.instructorName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">مهندس برمجيات أول · خبرة +10 سنوات</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><span className="text-yellow-500 font-bold">4.8</span> تقييم المدرب</span>
                    <span className="flex items-center gap-1">👨‍🎓 <span className="font-semibold text-slate-900 dark:text-white">279,900</span> طالب</span>
                    <span className="flex items-center gap-1">🎓 <span className="font-semibold text-slate-900 dark:text-white">8</span> كورسات</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    مهندسة برمجيات شغوفة بالتعليم مع خبرة تزيد عن 10 سنوات في بناء تطبيقات الويب والموبايل. تؤمن بأن التعلم يجب أن يكون ممتعاً وعملياً وقابلاً للتطبيق الفوري في سوق العمل.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT SIDEBAR (mobile / tablet) ── */}
          <div className="lg:hidden">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="relative aspect-video bg-slate-900 cursor-pointer group" onClick={() => setPreviewOpen(true)}>
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-primary-600 mr-[-3px]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">${course.price}</span>
                  {course.originalPrice > course.price && <span className="text-lg text-slate-400 line-through mb-0.5">${course.originalPrice}</span>}
                </div>
                {isEnrolled ? (
                  <button onClick={() => navigate(`/learn/${id}/${lessons[0]?.id ?? ''}`)} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">متابعة التعلم ←</button>
                ) : (
                  <button onClick={handleEnroll} className="w-full py-3 bg-gradient-to-l from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold rounded-xl transition-all shadow-lg">سجّل الآن</button>
                )}
                <button onClick={handleWishlist} className={`w-full py-2.5 rounded-xl border text-sm font-medium transition-colors ${isWishlisted ? 'border-red-400 text-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'}`}>
                  {isWishlisted ? '❤️ في المفضلة' : '🤍 أضف للمفضلة'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="معاينة الكورس" size="lg">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <iframe src={course.trailer} className="w-full h-full" allowFullScreen title="معاينة" />
        </div>
      </Modal>
    </div>
  )
}
