import type React from 'react'
import { useCallback, useState } from 'react'

import { 
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  FormHelperText
} from '@mui/material'

import {
  validateTitle,
  validateYear,
  validateActors
} from './validation/manualMovieValidation'
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
  const { data: movies } = useGetMoviesQuery({})

  const handleTitleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const error = validateTitle(title, movies);
    if (error) {
        setErrors(prev => ({ ...prev, title: error }));
    }
  }, [movies]);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const field = e.target.name
      const value = e.target.value

      setManualMovie(prev => ({ ...prev, [field]: value }));

      setErrors(prev => ({ ...prev, [field]: '' }));

      let error = '';
      switch (field) {
        case 'title':
          error = validateTitle(value, movies);
          break;
        case 'year':
          error = validateYear(value);
          break;
        case 'actors':
          error = validateActors(value); 
          break;
      }

      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
      }
  }, [movies, setManualMovie])

  const handleSubmit = useCallback(async () => {
    const newErrors: Record<string, string> = {}

    if (!manualMovie.title) newErrors.title = 'Title is required'
    if (!manualMovie.year) {
      newErrors.year = 'Year is required'
    } else {
      const numericYear = Number(manualMovie.year)
      if (isNaN(numericYear) || numericYear < 1900 || numericYear > 2021) {
        newErrors.year = 'Year must be between 1900 and 2021'
      }
    }
    if (!manualMovie.format) newErrors.format = 'Format is required'
    if (!manualMovie.actors.trim()) {
      newErrors.actors = 'Enter at least one actor'
    }

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

    try {
      await onSubmit()
      await onSuccess?.()
    } catch (e) {
      console.error('Error during submit:', e)
      await onError?.()
    }
  }, [manualMovie, movies, onSubmit, onSuccess, onError])
  
  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      <TextField
        name='title'
        label="Title"
        value={manualMovie.title}
        onChange={handleChange}
        onBlur={handleTitleBlur}
        fullWidth
        required
        error={!!errors.title}
        helperText={errors.title}
      />
      <TextField
        type='number'
        label="Year"
        name='year'
        value={manualMovie.year}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.year}
        helperText={errors.year}
        slotProps={{ htmlInput: { min: 1900, max: 2021 }}}
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
        name='actors'
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
