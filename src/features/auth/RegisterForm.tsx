import { FormEvent, useState } from 'react'

import {
  Box,
  Paper,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'

import { useRegisterMutation } from './authApi'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'

export function RegisterForm() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEmailError('')
    const newUser = {
      email,
      name: 'Default Name',
      password,
      confirmPassword: password,
    }

    const response = await register(newUser).unwrap()

    dispatch(setCredentials({ token: response.token }))
    response.token && localStorage.setItem('token', response.token) 
    setEmail('')
    setPassword('')

    if(response.error){
      const fields = response.error.fields

      if (fields['data/email']) {
        setEmailError('Wrong email')
      }
      if (fields['data/password']) {
        setPasswordError('Wrong password')
      }
    }
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, mx: 'auto', mt: 6, p: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Registration Form
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          required
          fullWidth
          autoFocus
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
          }}
          required
          fullWidth
          error={!!passwordError}
          helperText={passwordError}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
      </Box>
    </Paper>
  )
}
