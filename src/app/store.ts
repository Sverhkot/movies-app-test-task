import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import { moviesApi } from '../features/movies/apiSlice'
import { authApi } from '../features/auth/authApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(moviesApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [authApi.reducerPath]: authApi.reducer,
      [moviesApi.reducerPath]: moviesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(moviesApi.middleware),
    preloadedState: preloadedState as RootState | undefined,
  })
}

export type AppStore = typeof store
