import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface RegisterRequest {
  email: string
  name?: string
  password?: string
  confirmPassword?: string
}


export interface RegisterResponse {
  token: string
  user: { id: number; email: string; name: string }
  error?: {code: string; fields: {'data/email': string, 'data/password': string}}
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.219:8000/api/v1/' }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
})

export const { useRegisterMutation } = authApi
