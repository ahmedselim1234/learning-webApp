import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useGetCoursesQuery } from '../../store/services/coursesApi'
import CourseCard from '../../components/course/CourseCard'
import Skeleton from '../../components/ui/Skeleton'

const CATEGORIES = [
  { value: 'All', label: 'الكل' },
  { value: 'Web Development', label: 'تطوير الويب' },
  { value: 'Backend', label: 'الباك إند' },
  { value: 'Data Science', label: 'علم البيانات' },
  { value: 'Design', label: 'التصميم' },
  { value: 'Cloud', label: 'الحوسبة السحابية' },
  { value: 'Mobile', label: 'تطوير الجوال' },
  { value: 'Cybersecurity', label: 'الأمن السيبراني' },
]
const LEVELS = [
  { value: 'All', label: 'كل المستويات' },
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
]

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? 'All')
  const [level, setLevel] = useState('All')
  const [sortBy, setSortBy] = useState<'rating' | 'enrolled' | 'price-asc' | 'price-desc'>('rating')

  const { data: courses = [], isLoading } = useGetCoursesQuery()

  const filtered = useMemo(() => {
    let result = courses
    if (category !== 'All') result = result.filter(c => c.category === category)
    if (level !== 'All') result = result.filter(c => c.level === level)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'enrolled') return b.enrolled - a.enrolled
      if (sortBy === 'price-asc') return a.price - b.price
      return b.price - a.price
    })
  }, [courses, category, level, search, sortBy])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) setSearchParams({ search: search.trim() })
    else setSearchParams({})
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">جميع الكورسات</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {isLoading ? 'جارٍ التحميل...' : `${filtered.length} كورس متاح`}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-lg">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن كورس، مدرب، أو موضوع..."
            className="w-full pr-9 pl-4 py-2.5 text-sm bg-slate-100 dark:bg-slate-800 rounded-lg border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </form>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                category === cat.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mr-auto">
          {/* Level */}
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="text-sm px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent focus:border-primary-500 outline-none font-semibold"
          >
            {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent focus:border-primary-500 outline-none font-semibold"
          >
            <option value="rating">الأعلى تقييماً</option>
            <option value="enrolled">الأكثر شعبية</option>
            <option value="price-asc">السعر: من الأرخص</option>
            <option value="price-desc">السعر: من الأغلى</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="card" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">لا توجد كورسات مطابقة</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">جرّب تغيير الفلاتر أو كلمة البحث.</p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setLevel('All') }}
            className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
          >
            مسح جميع الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(course => <CourseCard key={course.id} course={course} />)}
        </div>
      )}
    </div>
  )
}
