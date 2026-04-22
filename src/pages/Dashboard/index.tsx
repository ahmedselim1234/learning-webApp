import { Link } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import { useGetCoursesQuery } from '../../store/services/coursesApi'
import { useGetLessonsByCourseIdQuery } from '../../store/services/lessonsApi'
import Avatar from '../../components/ui/Avatar'
import Skeleton from '../../components/ui/Skeleton'
import type { Course } from '../../types'

function ProgressCircle({ pct }: { pct: number }) {
  const r = 20, circ = 2 * Math.PI * r
  return (
    <svg width="52" height="52" className="-rotate-90">
      <circle cx="26" cy="26" r={r} fill="none" strokeWidth="4" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
      <circle cx="26" cy="26" r={r} fill="none" strokeWidth="4" stroke="currentColor"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        className="text-primary-500 transition-all duration-700" strokeLinecap="round" />
      <text x="26" y="26" textAnchor="middle" dominantBaseline="central"
        className="fill-slate-700 dark:fill-slate-300" style={{ fontSize: 9, fontWeight: 700, transform: 'rotate(90deg)', transformOrigin: '26px 26px' }}>
        {pct}%
      </text>
    </svg>
  )
}

function EnrolledCourseCard({ course, progress }: { course: Course; progress: number }) {
  const { data: lessons = [] } = useGetLessonsByCourseIdQuery(course.id)
  const nextLesson = lessons.find(l => !l.isFree) ?? lessons[0]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 right-2">
          <ProgressCircle pct={progress} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2">{course.title}</h3>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-3">
          <div className="bg-primary-600 h-1.5 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{progress}% مكتمل</span>
          <Link to={`/learn/${course.id}/${nextLesson?.id ?? ''}`}
            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
            {progress === 0 ? 'ابدأ الآن' : progress === 100 ? 'مراجعة' : 'متابعة'} ←
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const user = useAppSelector(s => s.auth.user)
  const enrollments = useAppSelector(s => s.enrollment.enrolledCourses)
  const wishlist = useAppSelector(s => s.wishlist.items)
  const { data: allCourses = [], isLoading } = useGetCoursesQuery()

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">يجب تسجيل الدخول أولاً</p>
          <Link to="/auth/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

  const enrolledCourses = allCourses.filter(c => enrollments[c.id])
  const wishlistCourses = allCourses.filter(c => wishlist.includes(c.id))
  const completedCourses = enrolledCourses.filter(c => enrollments[c.id]?.completed)
  const inProgressCourses = enrolledCourses.filter(c => !enrollments[c.id]?.completed)

  // Continue watching — highest progress not 100%
  const continueWatching = inProgressCourses
    .sort((a, b) => (enrollments[b.id]?.progress ?? 0) - (enrollments[a.id]?.progress ?? 0))[0]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              أهلاً، {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              استمر في رحلتك التعليمية
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'الكورسات المسجّلة', value: enrolledCourses.length, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20', icon: '📚' },
            { label: 'قيد التعلم', value: inProgressCourses.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: '▶️' },
            { label: 'مكتملة', value: completedCourses.length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: '✅' },
            { label: 'المفضلة', value: wishlist.length, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', icon: '❤️' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-transparent`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Continue watching banner */}
        {continueWatching && (
          <div className="bg-gradient-to-l from-primary-600 via-primary-700 to-accent-700 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4 text-white shadow-xl">
            <img src={continueWatching.thumbnail} alt={continueWatching.title} className="w-24 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-primary-200 text-xs mb-1">استكمل من حيث توقفت</p>
              <h3 className="font-black text-lg line-clamp-1">{continueWatching.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${enrollments[continueWatching.id]?.progress ?? 0}%` }} />
                </div>
                <span className="text-xs text-primary-200">{enrollments[continueWatching.id]?.progress ?? 0}%</span>
              </div>
            </div>
            <Link
              to={`/learn/${continueWatching.id}/${enrollments[continueWatching.id]?.lastLessonId ?? ''}`}
              className="bg-white text-primary-700 font-black px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-sm flex-shrink-0"
            >
              متابعة ←
            </Link>
          </div>
        )}

        {/* Enrolled courses */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-600 rounded-full" />
            كورساتي المسجّلة
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => <Skeleton key={i} variant="card" />)}
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center">
              <div className="text-5xl mb-3">📚</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">لم تسجّل في أي كورس بعد</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">ابدأ رحلتك التعليمية الآن!</p>
              <Link to="/courses" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors">
                تصفح الكورسات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledCourses.map(course => (
                <EnrolledCourseCard key={course.id} course={course} progress={enrollments[course.id]?.progress ?? 0} />
              ))}
            </div>
          )}
        </section>

        {/* Certificates */}
        {completedCourses.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-yellow-500 rounded-full" />
              شهاداتي 🏆
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {completedCourses.map(course => (
                <div key={course.id} className="bg-gradient-to-l from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 flex items-center gap-4">
                  <div className="text-4xl flex-shrink-0">🏆</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mb-0.5">شهادة إتمام</p>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{enrollments[course.id]?.enrolledAt?.split('T')[0]}</p>
                  </div>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
                    تحميل
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Wishlist */}
        {wishlistCourses.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full" />
              قائمة المفضلة ❤️
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlistCourses.map(course => (
                <Link key={course.id} to={`/courses/${course.id}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all flex gap-0">
                  <img src={course.thumbnail} alt={course.title} className="w-28 object-cover flex-shrink-0" />
                  <div className="p-3 flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2 mb-1">{course.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">★ {course.rating}</div>
                    <p className="text-primary-600 dark:text-primary-400 font-black text-sm mt-1">${course.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
