import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../../app/store'

export interface Actor {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Movie {
  id: string
  title: string
  year: number
  format: 'VHS' | 'DVD' | 'Blu-Ray'
  actors: Actor[] 
  createdAt: string
  updatedAt: string
}

export interface MovieInput {
  title: string
  year: number
  format: 'VHS' | 'DVD' | 'Blu-Ray'
  actors: string[]
}

type MovieFilters = {
  title?: string
  year?: number
  actor?: string
  sort?: string
  order?: 'ASC' | 'DESC'
  limit?: number
}

export const moviesApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.219:8000/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', token)
      }
      return headers
    },
  }),
  tagTypes: ['Movie'],
  endpoints: (builder) => ({
    getMovie: builder.query<Movie, number>({
      query: (id) => `movies/${id}`,
      transformResponse: (response: { data: Movie }) => response.data,
    }),
    getMovies: builder.query<Movie[], MovieFilters>({
      query: ({ title, actor, sort = 'year', order = 'DESC', limit = 1000 }) => {
        const params: Record<string, any> = {
          sort,
          order,
          limit,
        }

        if (title) params.title = title
        if (actor) params.actor = actor

        return {
          url: 'movies',
          params,
        }
      },
      
      transformResponse: (response: { data: Movie[] }) => response.data,
      providesTags: ['Movie'],
    }),
    addMovie: builder.mutation<Movie, MovieInput>({
      query: (newMovie) => ({
        url: 'movies',
        method: 'POST',
        body: newMovie,
      }),
      invalidatesTags: ['Movie'], 
    }),
    deleteMovie: builder.mutation<void, string>({
      query: (id) => ({
        url: `movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movie'],
    }),
    importMovies: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: 'movies/import',
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Movie'],
    })
  }),
})

export const {
  useLazyGetMovieQuery,
  useGetMoviesQuery,
  useAddMovieMutation,
  useDeleteMovieMutation,
  useImportMoviesMutation,
} = moviesApi