import type { FormEvent} from 'react'
import { useState } from 'react'

import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'

import { useAppDispatch } from '../../app/hooks'
import { setCredentials } from './authSlice'
import { useRegisterMutation } from './authApi'

export function RegisterForm() {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailError('')
    const newUser = {
      email,
      name: 'Default Name',
      password,
      confirmPassword: password,
    }

    register(newUser).unwrap()
      .then((response) => {
        dispatch(setCredentials({ token: response.token }))
        if (response.token) {
          localStorage.setItem('token', response.token)
        }
        setEmail('')
        setPassword('')
      })
      .catch((error: unknown) => {
        if (error && typeof error === 'object' && 'fields' in error) {
          const fields = (error as { fields: Record<string, Record<string, string>> }).fields

          if ('data/email' in fields) {
            setEmailError('Wrong email')
          }
          if ('data/password' in fields) {
            setPasswordError('Wrong password')
          }
        }
      })
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 4 }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Registration Form
      </Typography>

      <Box
        sx={{ 
          gap: 2,
          display: 'flex', 
          flexDirection: 'column'
        }}
        noValidate
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          required
          type="email"
          label="Email"
          value={email}
          fullWidth
          autoFocus
          error={!!emailError}
          helperText={emailError}
          onChange={e => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
        />

        <TextField
          required
          label="Password"
          type="password"
          value={password}
          fullWidth
          error={!!passwordError}
          helperText={passwordError}
          onChange={e => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
          }}

        />

        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </Box>
    </Paper>
  )
}
