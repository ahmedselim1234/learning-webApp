import { createApi } from '@reduxjs/toolkit/query/react'
import { mockBaseQuery } from './mockBaseQuery'
import type { Review } from '../../types'
import reviewsData from '../../data/reviews.json'

const reviews = reviewsData as Review[]

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: mockBaseQuery,
  endpoints: builder => ({
    getReviewsByCourseId: builder.query<Review[], string>({
      queryFn: (courseId) => ({
        data: reviews.filter(r => r.courseId === courseId),
      }),
    }),
  }),
})

export const { useGetReviewsByCourseIdQuery } = reviewsApi
