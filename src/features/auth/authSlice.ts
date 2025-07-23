import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  token: sessionStorage.getItem('token')
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      sessionStorage.setItem('token', action.payload)
    },
    clearToken: (state) => {
      state.token = null
      sessionStorage.removeItem('token')
    }
  }
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer
