export type UserRole = 'student' | 'instructor' | 'admin'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type ToastType = 'success' | 'error' | 'info' | 'warning'
export type Theme = 'light' | 'dark'

export interface Course {
  id: string
  title: string
  thumbnail: string
  instructor: string
  instructorName: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  category: string
  level: CourseLevel
  description: string
  trailer: string
  totalLessons: number
  totalDuration: string
  enrolled: number
  tags: string[]
  language: string
  lastUpdated: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  videoUrl: string
  duration: string
  order: number
  isFree: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  bio: string
  enrolledCourses: string[]
  completedLessons: string[]
  wishlist: string[]
  myCourses?: string[]
  totalStudents?: number
  totalRevenue?: number
  joinedAt: string
}

export interface Review {
  id: string
  courseId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

export interface EnrollmentRecord {
  courseId: string
  enrolledAt: string
  completedLessons: string[]
  progress: number
  lastLessonId?: string
  completed: boolean
  certificateIssued: boolean
}

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
