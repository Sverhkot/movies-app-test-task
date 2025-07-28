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

import type { MovieInput } from './apiSlice'
import { useGetMoviesQuery, useAddMovieMutation } from './apiSlice'

type ManualMovieFormProps = {
  onSuccess?: () => Promise<void>
  onError?: () => void
}

export default function ManualMovieForm({ onSuccess, onError }: ManualMovieFormProps) {
  const [addMovie] = useAddMovieMutation()

  const [manualMovie, setManualMovie] = useState<{
    title: string
    year: string
    format: '' | 'VHS' | 'DVD' | 'Blu-Ray'
    actors: string
  }>({
    title: '',
    year: '',
    format: '',
    actors: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { data: movies, refetch } = useGetMoviesQuery({})

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const field = e.target.name
      const value = field === 'actors' ? e.target.value.replace(/[0-9]/g, '') : e.target.value

      setManualMovie(prev => ({ ...prev, [field]: value }))
      setErrors(prev => ({ ...prev, [field]: '' }))

      let error = ''
      switch (field) {
        case 'title':
          error = validateTitle(value, movies)
          break
        case 'year':
          error = validateYear(value)
          break
        case 'actors':
          error = validateActors(value)
          break
      }

      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    },
    [movies]
  )

  const handleTitleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const title = e.target.value
      const error = validateTitle(title, movies)
      if (error) {
        setErrors(prev => ({ ...prev, title: error }))
      }
    },
    [movies]
  )

  const handleSubmit = useCallback(async () => {
    const newErrors: Record<string, string> = {}

    const titleError = validateTitle(manualMovie.title, movies)
    if (titleError) {
      newErrors.title = titleError
    }

    if (!manualMovie.year) {
      newErrors.year = 'Year is required'
    } else {
      const yearError = validateYear(manualMovie.year)
      if (yearError) newErrors.year = yearError
    }

    if (!manualMovie.format) newErrors.format = 'Format is required'

    const actorsError = validateActors(manualMovie.actors)
    if (actorsError) {
      newErrors.actors = actorsError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const capitalizeName = (name: string) => {
      return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')
    }

    const newMovie: MovieInput = {
      title: manualMovie.title.trim(),
      year: Number(manualMovie.year),
      format: manualMovie.format as "VHS" | "DVD" | "Blu-Ray",
      actors: manualMovie.actors
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(capitalizeName)
    }

    try {
      await addMovie(newMovie).unwrap()
      await refetch()
      setManualMovie({ title: '', year: '', format: '', actors: '' })
      await onSuccess?.()
      
    } catch (e) {
      console.error('Error during submit:', e)
      console.log(e)
      onError?.()
    }
  }, [manualMovie, movies, addMovie, refetch, onError, onSuccess])

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      <TextField
        name="title"
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
        type="number"
        label="Year"
        name="year"
        value={manualMovie.year}
        onChange={handleChange}
        fullWidth
        required
        error={!!errors.year}
        helperText={errors.year}
        slotProps={{ htmlInput: { min: 1900, max: 2021 } }}
        onKeyDown={e => {
          if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault()
          }
        }}
      />
      <FormControl>
        <Select
          value={manualMovie.format}
          onChange={e => {
            setManualMovie(prev => ({ ...prev, format: e.target.value }))
            setErrors(prev => ({ ...prev, format: '' }))
          }}
          displayEmpty
          fullWidth
          error={!!errors.format}
        >
          <MenuItem value="" disabled>
            Select format
          </MenuItem>
          <MenuItem value="VHS">VHS</MenuItem>
          <MenuItem value="DVD">DVD</MenuItem>
          <MenuItem value="Blu-Ray">Blu-Ray</MenuItem>
        </Select>
        <FormHelperText error>{errors.format}</FormHelperText>
      </FormControl>
      <TextField
        label="Actors (comma separated)"
        name="actors"
        value={manualMovie.actors}
        onChange={handleChange}
        onKeyDown={e => {
          if (/\d/.test(e.key)) {
            e.preventDefault()
          }
        }}
        fullWidth
        required
        error={!!errors.actors}
        helperText={errors.actors}
      />
      <Button variant="contained" onClick={() => void handleSubmit()}>
        Add Movie
      </Button>
    </Box>
  )
}
