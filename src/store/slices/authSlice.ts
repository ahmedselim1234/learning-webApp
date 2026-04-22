import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const stored = localStorage.getItem('auth')
const initial: AuthState = stored
  ? JSON.parse(stored)
  : { user: null, token: null, isAuthenticated: false }

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('auth', JSON.stringify(state))
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('auth')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
