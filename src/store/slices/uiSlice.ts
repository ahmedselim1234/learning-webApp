import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Toast, Theme } from '../../types'

export type Language = 'ar' | 'en'

interface UiState {
  theme: Theme
  language: Language
  toasts: Toast[]
}

const stored = localStorage.getItem('theme') as Theme | null
const storedLang = localStorage.getItem('language') as Language | null
const initial: UiState = {
  theme: stored ?? 'light',
  language: storedLang ?? 'ar',
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: initial,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
      document.documentElement.classList.toggle('dark', state.theme === 'dark')
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
      document.documentElement.classList.toggle('dark', action.payload === 'dark')
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({ ...action.payload, id: Date.now().toString() })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    toggleLanguage(state) {
      state.language = state.language === 'ar' ? 'en' : 'ar'
      localStorage.setItem('language', state.language)
      document.documentElement.lang = state.language
      document.documentElement.dir = state.language === 'ar' ? 'rtl' : 'ltr'
    },
  },
})

export const { toggleTheme, setTheme, addToast, removeToast, toggleLanguage } = uiSlice.actions
export default uiSlice.reducer
