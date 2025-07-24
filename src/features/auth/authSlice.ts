import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token
      state.error = null
    },
  },
})

export default authSlice.reducer
export const { setCredentials} = authSlice.actions