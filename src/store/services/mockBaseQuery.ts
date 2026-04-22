import type { BaseQueryFn } from '@reduxjs/toolkit/query'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export interface MockRequest {
  data: unknown
  ms?: number
}

export const mockBaseQuery: BaseQueryFn<MockRequest> = async ({ data, ms = 300 }) => {
  await delay(ms)
  return { data }
}
