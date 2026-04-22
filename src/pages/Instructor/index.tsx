import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { useAppSelector } from '../../hooks/redux'
import { useGetCoursesQuery } from '../../store/services/coursesApi'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import type { CourseLevel } from '../../types'

const COLORS = ['#4f46e5', '#a855f7', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6']

const enrollmentData = [
  { month: 'يناير', students: 1200 },
  { month: 'فبراير', students: 1900 },
  { month: 'مارس', students: 1600 },
  { month: 'أبريل', students: 2400 },
  { month: 'مايو', students: 2200 },
  { month: 'يونيو', students: 3100 },
  { month: 'يوليو', students: 2800 },
  { month: 'أغسطس', students: 3600 },
  { month: 'سبتمبر', students: 4200 },
  { month: 'أكتوبر', students: 3900 },
  { month: 'نوفمبر', students: 4800 },
  { month: 'ديسمبر', students: 5200 },
]

const revenueData = [
  { name: 'React', revenue: 12400 },
  { name: 'Node.js', revenue: 8900 },
  { name: 'Python', revenue: 18200 },
  { name: 'UI/UX', revenue: 6700 },
  { name: 'AWS', revenue: 9400 },
  { name: 'Flutter', revenue: 7300 },
  { name: 'Hacking', revenue: 15600 },
  { name: 'GraphQL', revenue: 4800 },
]

const completionData = [
  { name: 'مكتمل', value: 68 },
  { name: 'جارٍ', value: 22 },
  { name: 'لم يبدأ', value: 10 },
]

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

function StatCard({ label, value, sub, icon, color }: { label: string; value: string; sub?: string; icon: string; color: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5`}>
      <div className={`text-2xl mb-3 w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-green-500 font-semibold mt-1">{sub}</div>}
    </div>
  )
}

export default function Instructor() {
  const user = useAppSelector(s => s.auth.user)
  const { data: allCourses = [] } = useGetCoursesQuery()
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'analytics'>('overview')

  const myCourses = allCourses.filter(c => c.instructor === 'u3')

  if (!user || user.role !== 'instructor') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">هذه الصفحة للمدربين فقط</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">سجّل الدخول بحساب sarah@example.com للوصول</p>
          <Link to="/auth/login" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">استوديو المدرب</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">مرحباً، {user.name.split(' ')[0]}! إليك ملخص أداء كورساتك.</p>
          </div>
          <button className="mr-auto hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            كورس جديد
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
          {(['overview', 'courses', 'analytics'] as const).map(tab => {
            const labels = { overview: '📊 نظرة عامة', courses: '📚 كورساتي', analytics: '📈 التحليلات' }
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}>
                {labels[tab]}
              </button>
            )
          })}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="إجمالي الطلاب" value="279,900" sub="↑ 12% هذا الشهر" icon="👨‍🎓" color="bg-primary-50 dark:bg-primary-900/20" />
              <StatCard label="إجمالي الإيرادات" value="$83,300" sub="↑ 8% هذا الشهر" icon="💰" color="bg-green-50 dark:bg-green-900/20" />
              <StatCard label="الكورسات المنشورة" value={String(myCourses.length)} icon="🎓" color="bg-yellow-50 dark:bg-yellow-900/20" />
              <StatCard label="متوسط التقييم" value="4.8 ★" icon="⭐" color="bg-accent-50 dark:bg-accent-900/20" />
            </div>

            {/* Quick chart */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-black text-slate-900 dark:text-white mb-5">التسجيلات الشهرية</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} />
                  <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} name="طلاب جدد" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── COURSES TAB ── */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {myCourses.map(course => (
              <div key={course.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex gap-4 items-center hover:shadow-md transition-shadow">
                <img src={course.thumbnail} alt={course.title} className="w-24 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={levelVariant[course.level]}>{levelAr[course.level]}</Badge>
                    <Badge variant="primary">{course.category}</Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{course.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>👨‍🎓 {course.enrolled.toLocaleString()} طالب</span>
                    <span>⭐ {course.rating}</span>
                    <span>⏱ {course.totalDuration}</span>
                  </div>
                </div>
                <div className="text-left flex-shrink-0">
                  <div className="text-lg font-black text-primary-600 dark:text-primary-400">${course.price}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{course.totalLessons} درس</div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1.5 rounded-lg font-bold hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
                    تعديل
                  </button>
                  <Link to={`/courses/${course.id}`} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-center">
                    عرض
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue by course */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-black text-slate-900 dark:text-white mb-5">الإيرادات لكل كورس ($)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} width={60} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'الإيراد']} />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                      {revenueData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Completion rate */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-black text-slate-900 dark:text-white mb-5">معدل إكمال الكورسات</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={completionData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                      {completionData.map((_, idx) => (
                        <Cell key={idx} fill={['#4f46e5', '#a855f7', '#e2e8f0'][idx]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(v: number) => [`${v}%`]} />
                    <Legend formatter={(v: string) => <span style={{ fontSize: 12, color: '#64748b' }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  {completionData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-sm">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#4f46e5', '#a855f7', '#e2e8f0'][i] }} />
                      <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly enrollment full */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-black text-slate-900 dark:text-white mb-5">التسجيلات طوال العام</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }} formatter={(v: number) => [v.toLocaleString(), 'طالب جديد']} />
                  <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#4f46e5' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
