import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
  actors: Actor[] // Changed from string[] to Actor[]
  createdAt: string
  updatedAt: string
}

export interface MovieInput {
  title: string
  year: number
  format: 'VHS' | 'DVD' | 'Blu-Ray'
  actors: string[] // Input still uses string[] for manual entry
}

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://192.168.1.219:8000/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).auth.token
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwidXBkYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwiaWF0IjoxNzUzMTEzNjAzfQ.8qsVfeAyyCHgdw-M3e8ByMgMU5EY2jMftw0gJ01GAg8";
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
    getMovies: builder.query<Movie[], void>({
      query: () => 'movies',
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
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export interface Movie{
//     id: string
//     title: string
//     year: number
//     format: 'VHS' | 'DVD' | 'Blu-Ray'
//     actors: string[]
// }

// export const moviesApi = createApi({
//   reducerPath: 'moviesApi',
//   baseQuery: fetchBaseQuery({ 
//     baseUrl: 'http://192.168.1.219:8000/api/v1/',
//     prepareHeaders: (headers, { getState }) => {
//       // const token = (getState() as RootState).auth.token
//       const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwidXBkYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwiaWF0IjoxNzUzMTEzNjAzfQ.8qsVfeAyyCHgdw-M3e8ByMgMU5EY2jMftw0gJ01GAg8";
//       if (token) {
//         headers.set('Authorization', token)
//       }
//       return headers
//     },
//   }),
//   tagTypes: ['Movie'],
//   endpoints: (builder) => ({
//     getMovie: builder.query<Movie, number>({
//       query: (id) => `movies/${id}`,
//       transformResponse: (response: { data: Movie }) => response.data,
//     }),
//     getMovies: builder.query<Movie[], void>({
//       query: () => 'movies',
//       transformResponse: (response: { data: Movie[] }) => response.data,
//       providesTags: ['Movie'],
//     }),
//     addMovie: builder.mutation<Movie, Omit<Movie, 'id'>>({
//       query: (newMovie) => ({
//         url: 'movies',
//         method: 'POST',
//         body: newMovie,
//       }),
//       invalidatesTags: ['Movie'], 
//     }),
//     deleteMovie: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `movies/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Movie'],
//     }),
//     importMovies: builder.mutation<void, FormData>({
//       query: (formData) => ({
//         url: 'movies/import',
//         method: 'POST',
//         body: formData
//       }),
//       invalidatesTags: ['Movie'],
//     })
//   }),
// })

// export const {
//   useLazyGetMovieQuery,
//   useGetMoviesQuery,
//   useAddMovieMutation,
//   useDeleteMovieMutation,
//   useImportMoviesMutation,
// } = moviesApi
