import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { toggleWishlist } from '../../store/slices/wishlistSlice'
import Badge from '../ui/Badge'
import type { Course, CourseLevel } from '../../types'

interface CourseCardProps {
  course: Course
}

const levelVariant: Record<CourseLevel, 'beginner' | 'intermediate' | 'advanced'> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <span className="flex items-center gap-1 text-sm">
      <span className="font-semibold text-yellow-600 dark:text-yellow-400">{rating.toFixed(1)}</span>
      <span className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      <span className="text-slate-400 text-xs">({reviewCount.toLocaleString()})</span>
    </span>
  )
}

export default function CourseCard({ course }: CourseCardProps) {
  const dispatch = useAppDispatch()
  const isWishlisted = useAppSelector(s => s.wishlist.items.includes(course.id))
  const isEnrolled = useAppSelector(s => !!s.enrollment.enrolledCourses[course.id])

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(course.id))
  }

  const discount = Math.round((1 - course.price / course.originalPrice) * 100)

  return (
    <Link to={`/courses/${course.id}`} className="group block">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-700">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-slate-400'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}
          {isEnrolled && (
            <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
              Enrolled
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={levelVariant[course.level]}>{course.level}</Badge>
            <Badge variant="default">{course.category}</Badge>
          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{course.instructorName}</p>

          <StarRating rating={course.rating} reviewCount={course.reviewCount} />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-slate-900 dark:text-white">${course.price}</span>
              {course.originalPrice > course.price && (
                <span className="text-xs text-slate-400 line-through">${course.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.totalDuration}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
