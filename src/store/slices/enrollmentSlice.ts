import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnrollmentRecord } from '../../types'

interface EnrollmentState {
  enrolledCourses: Record<string, EnrollmentRecord>
}

const stored = localStorage.getItem('enrollments')
const initial: EnrollmentState = stored
  ? JSON.parse(stored)
  : { enrolledCourses: {} }

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState: initial,
  reducers: {
    enroll(state, action: PayloadAction<string>) {
      const courseId = action.payload
      if (!state.enrolledCourses[courseId]) {
        state.enrolledCourses[courseId] = {
          courseId,
          enrolledAt: new Date().toISOString(),
          completedLessons: [],
          progress: 0,
          completed: false,
          certificateIssued: false,
        }
        localStorage.setItem('enrollments', JSON.stringify(state))
      }
    },
    markLessonComplete(state, action: PayloadAction<{ courseId: string; lessonId: string; totalLessons: number }>) {
      const { courseId, lessonId, totalLessons } = action.payload
      const record = state.enrolledCourses[courseId]
      if (record && !record.completedLessons.includes(lessonId)) {
        record.completedLessons.push(lessonId)
        record.lastLessonId = lessonId
        record.progress = Math.round((record.completedLessons.length / totalLessons) * 100)
        if (record.progress === 100) record.completed = true
        localStorage.setItem('enrollments', JSON.stringify(state))
      }
    },
    issueCertificate(state, action: PayloadAction<string>) {
      const record = state.enrolledCourses[action.payload]
      if (record) {
        record.certificateIssued = true
        localStorage.setItem('enrollments', JSON.stringify(state))
      }
    },
  },
})

export const { enroll, markLessonComplete, issueCertificate } = enrollmentSlice.actions
export default enrollmentSlice.reducer
