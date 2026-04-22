import { createApi } from '@reduxjs/toolkit/query/react'
import { mockBaseQuery } from './mockBaseQuery'
import type { User } from '../../types'
import usersData from '../../data/users.json'

const users = usersData as User[]

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: mockBaseQuery,
  endpoints: builder => ({
    getUserById: builder.query<User, string>({
      queryFn: (id) => {
        const user = users.find(u => u.id === id)
        if (!user) return { error: { status: 404, error: 'User not found' } }
        return { data: user }
      },
    }),
  }),
})

export const { useGetUserByIdQuery } = usersApi
