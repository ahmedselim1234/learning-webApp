import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import CourseCard from '../../components/course/CourseCard'
import Skeleton from '../../components/ui/Skeleton'
import { useGetCoursesQuery } from '../../store/services/coursesApi'
import { useTranslation } from '../../hooks/useTranslation'

const CATEGORIES = [
  { key: 'Web Development',  labelKey: 'courses_web',      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-400' },
  { key: 'Data Science',     labelKey: 'courses_data',     icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, color: 'bg-green-50 dark:bg-green-900/20 border-green-200/60 dark:border-green-800/40 text-green-700 dark:text-green-400' },
  { key: 'Design',           labelKey: 'courses_design',   icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />, color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200/60 dark:border-purple-800/40 text-purple-700 dark:text-purple-400' },
  { key: 'Mobile',           labelKey: 'courses_mobile',   icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />, color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200/60 dark:border-yellow-800/40 text-yellow-700 dark:text-yellow-400' },
  { key: 'Cloud',            labelKey: 'courses_cloud',    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />, color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200/60 dark:border-sky-800/40 text-sky-700 dark:text-sky-400' },
  { key: 'Cybersecurity',    labelKey: 'courses_security', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, color: 'bg-red-50 dark:bg-red-900/20 border-red-200/60 dark:border-red-800/40 text-red-700 dark:text-red-400' },
] as const

export default function Home() {
  const { t } = useTranslation()
  const { data: courses = [], isLoading } = useGetCoursesQuery()
  const topRated = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4)

  const stats = [
    { value: '+10,000', labelKey: 'home_stats_courses' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { value: '+500K',   labelKey: 'home_stats_students' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { value: '+1,200',  labelKey: 'home_stats_inst' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /> },
    { value: '4.8',     labelKey: 'home_stats_rating' as const, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> },
  ]

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-l from-primary-900 via-primary-800 to-accent-900 text-white py-24 px-4">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t('home_badge')}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6">
            {t('home_hero_title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-yellow-300 to-amber-400">
              {t('home_hero_sub')}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home_hero_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/courses">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto font-black text-base">{t('home_hero_browse')}</Button>
            </Link>
            <Link to="/auth/register">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto border border-white/30 text-white hover:bg-white/10 font-black text-base">{t('home_hero_free')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(stat => (
              <div key={stat.labelKey} className="space-y-2">
                <div className="flex justify-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{stat.icon}</svg>
                  </div>
                </div>
                <div className="text-3xl font-black text-primary-600 dark:text-primary-400">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('home_cats_title')}</h2>
          <Link to="/courses" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">{t('home_view_all')} ←</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat.key} to={`/courses?category=${encodeURIComponent(cat.key)}`}
              className={`${cat.color} border rounded-2xl p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{cat.icon}</svg>
              </div>
              <span className="text-xs font-bold text-center leading-snug">{t(cat.labelKey)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t('home_featured')}</h2>
          <Link to="/courses" className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">{t('home_view_all')} ←</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" />)
            : topRated.map(course => <CourseCard key={course.id} course={course} />)
          }
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-l from-accent-700 to-primary-700 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">{t('home_cta_title')}</h2>
          <p className="text-primary-200 mb-8">{t('home_cta_desc')}</p>
          <Link to="/instructor">
            <Button size="lg" variant="secondary" className="font-black">{t('home_cta_btn')} ←</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
