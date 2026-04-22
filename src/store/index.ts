import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import enrollmentReducer from './slices/enrollmentSlice'
import wishlistReducer from './slices/wishlistSlice'
import uiReducer from './slices/uiSlice'
import { coursesApi } from './services/coursesApi'
import { lessonsApi } from './services/lessonsApi'
import { usersApi } from './services/usersApi'
import { reviewsApi } from './services/reviewsApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    enrollment: enrollmentReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: getDefault =>
    getDefault()
      .concat(coursesApi.middleware)
      .concat(lessonsApi.middleware)
      .concat(usersApi.middleware)
      .concat(reviewsApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
