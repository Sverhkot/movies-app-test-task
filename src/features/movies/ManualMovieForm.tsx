import type React from 'react'
import { useState } from 'react'

import { 
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  FormHelperText
} from '@mui/material'

import { useGetMoviesQuery } from './apiSlice'

type ManualMovieFormProps = {
  onSuccess?: () => Promise<void>
  onError?: () => Promise<void>
  manualMovie: {
    title: string
    year: string
    format: string
    actors: string
  }
  setManualMovie: React.Dispatch<React.SetStateAction<{
    title: string
    year: string
    format: string
    actors: string
  }>>
  onSubmit: () => Promise<void>
}

export default function ManualMovieForm({
  onSubmit,
  onSuccess,
  onError,
  manualMovie,
  setManualMovie
}: ManualMovieFormProps) {

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string) => (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value

      setManualMovie(prev => ({ ...prev, [field]: value }))
      setErrors(prev => ({ ...prev, [field]: '' }))

    if (field === 'title') {
      const isDuplicate = movies?.some(
        movie => movie.title.trim().toLowerCase() === value.trim().toLowerCase()
      )
      if (isDuplicate) {
        setErrors(prev => ({ ...prev, title: 'Movie with this title already exists' }))
      }
    }

    if (field === 'year') {
      const numericValue = Number(value)
      if (
        value !== '' &&
        (isNaN(numericValue) || numericValue < 1850 || numericValue > 2021)
      ) {
        setErrors(prev => ({
          ...prev,
          year: 'Year must be between 1850 and 2021'
        }))
      }
    }

   if (field === 'actors') {
    const trimmedValue = value.trim()

    if (trimmedValue === '') {
      setErrors(prev => ({
        ...prev,
        actors: 'Actors field cannot be empty or only spaces',
      }))
      return
    }


    const containsLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(trimmedValue)
    if (!containsLetter) {
      setErrors(prev => ({
        ...prev,
        actors: 'Actors field must contain at least one letter',
      }))
      return
    }

    const hasInvalidCharacters = /[^a-zA-Zа-яА-ЯёЁ\s,.-]/.test(value)
    if (hasInvalidCharacters) {
      setErrors(prev => ({
        ...prev,
        actors: 'Only letters, commas, dots, spaces and hyphens are allowed',
      }))
      return
    }
  }
  }

  const { data: movies } = useGetMoviesQuery({})

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}

    if (!manualMovie.title) newErrors.title = 'Title is required'
    if (!manualMovie.year) newErrors.year = 'Year is required'
    if (!manualMovie.format) newErrors.format = 'Format is required'
    if (!manualMovie.actors) newErrors.actors = 'Enter at least one actor'

    const isDuplicate = movies?.some(
      (movie) => movie.title.trim().toLowerCase() === manualMovie.title.trim().toLowerCase()
    )

    if (isDuplicate) {
      newErrors.title = 'Movie with this title already exists'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!manualMovie.actors.trim()) {
      newErrors.actors = 'Please enter at least one actor'
    }

    // onSubmit()
    try {
      await onSubmit()
      await onSuccess?.()
    } catch (e) {
      console.error('Error during submit:', e)
      await onError?.()
    }
  }
  
  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      <TextField
        label="Title"
        value={manualMovie.title}
        onChange={handleChange('title')}
        fullWidth
        required
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        type='number'
        label="Year"
        value={manualMovie.year}
        onChange={handleChange('year')}
        fullWidth
        required
        error={!!errors.year}
        helperText={errors.year}
        slotProps={{ htmlInput: { min: 1850, max: 2021 }}}
        onKeyDown={(e) => {
          if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault()
          }
        }}
      />
      <FormControl>
        <Select
          value={manualMovie.format}
          onChange={(e) => {  
            setManualMovie({ ...manualMovie, format: e.target.value})
            setErrors(prev => ({ ...prev, format: '' }))
          }}
          displayEmpty
          fullWidth
          error={!!errors.format}
        >
          <MenuItem value="" disabled>Select format</MenuItem>
          <MenuItem value="VHS">VHS</MenuItem>
          <MenuItem value="DVD">DVD</MenuItem>
          <MenuItem value="Blu-Ray">Blu-Ray</MenuItem>
        </Select>
        <FormHelperText error>{errors.format}</FormHelperText>
      </FormControl>
      <TextField
        label="Actors (comma separated)"
        value={manualMovie.actors}
        onChange={(e) => {
          const value = e.target.value.replace(/[0-9]/g, '')
          setManualMovie({ ...manualMovie, actors: value })
        }}
        onKeyDown={(e) => {
          if (/\d/.test(e.key)) {
            e.preventDefault()
          }
        }}
        fullWidth
        required
        error={!!errors.actors}
        helperText={errors.actors}
      />
      <Button variant="contained" onClick={() => { void handleSubmit() }}>Add Movie</Button>
    </Box>
  )
}
