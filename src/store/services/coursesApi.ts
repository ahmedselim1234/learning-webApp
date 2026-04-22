import { createApi } from '@reduxjs/toolkit/query/react'
import { mockBaseQuery } from './mockBaseQuery'
import type { Course } from '../../types'
import coursesData from '../../data/courses.json'

const courses = coursesData as Course[]

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Course'],
  endpoints: builder => ({
    getCourses: builder.query<Course[], { category?: string; level?: string; search?: string } | void>({
      queryFn: (args) => {
        let result = courses
        if (args?.category) result = result.filter(c => c.category === args.category)
        if (args?.level) result = result.filter(c => c.level === args.level)
        if (args?.search) {
          const q = args.search.toLowerCase()
          result = result.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.instructorName.toLowerCase().includes(q) ||
            c.tags.some(t => t.toLowerCase().includes(q))
          )
        }
        return { data: result }
      },
      providesTags: ['Course'],
    }),
    getCourseById: builder.query<Course, string>({
      queryFn: (id) => {
        const course = courses.find(c => c.id === id)
        if (!course) return { error: { status: 404, error: 'Course not found' } }
        return { data: course }
      },
      providesTags: (_r, _e, id) => [{ type: 'Course', id }],
    }),
  }),
})

export const { useGetCoursesQuery, useGetCourseByIdQuery } = coursesApi
