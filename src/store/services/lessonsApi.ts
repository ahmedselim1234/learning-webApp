import { createApi } from '@reduxjs/toolkit/query/react'
import { mockBaseQuery } from './mockBaseQuery'
import type { Lesson } from '../../types'
import lessonsData from '../../data/lessons.json'

const lessons = lessonsData as Lesson[]

export const lessonsApi = createApi({
  reducerPath: 'lessonsApi',
  baseQuery: mockBaseQuery,
  endpoints: builder => ({
    getLessonsByCourseId: builder.query<Lesson[], string>({
      queryFn: (courseId) => ({
        data: lessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order),
      }),
    }),
    getLessonById: builder.query<Lesson, string>({
      queryFn: (id) => {
        const lesson = lessons.find(l => l.id === id)
        if (!lesson) return { error: { status: 404, error: 'Lesson not found' } }
        return { data: lesson }
      },
    }),
  }),
})

export const { useGetLessonsByCourseIdQuery, useGetLessonByIdQuery } = lessonsApi
