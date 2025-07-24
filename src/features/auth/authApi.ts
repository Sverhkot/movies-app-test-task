import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { CONFIG } from "../../config"

export type RegisterRequest = {
  email: string
  name?: string
  password?: string
  confirmPassword?: string
}


export type RegisterResponse = {
  token: string
  user: { id: number; email: string; name: string }
  error?: {code: string; fields: {'data/email': string, 'data/password': string}}
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: (() => {
      const apiUrl = CONFIG.API_URL;
      if (!apiUrl) {
        throw new Error('API_URL configuration is required but not provided');
      }
      return apiUrl;
    })()
  }),
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
