import type React from 'react'
import { TextField, Button, Box, Select, MenuItem } from '@mui/material'

type ManualMovieFormProps = {
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
  onSubmit: () => void
}

export default function ManualMovieForm({
  manualMovie,
  setManualMovie,
  onSubmit
}: ManualMovieFormProps) {
  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualMovie(prev => ({ ...prev, [field]: e.target.value }))
  }
  return (
    <Box display="flex" flexDirection="column" gap={2} mb={3}>
      <TextField
        label="Title"
        value={manualMovie.title}
        onChange={handleChange('title')}
        fullWidth
      />
      <TextField
        label="Year"
        value={manualMovie.year}
        onChange={handleChange('year')}
        fullWidth
      />
      <Select
        value={manualMovie.format}
        onChange={(e) => { setManualMovie({ ...manualMovie, format: e.target.value }); }}
        displayEmpty
        fullWidth
      >
        <MenuItem value="" disabled>Select format</MenuItem>
        <MenuItem value="VHS">VHS</MenuItem>
        <MenuItem value="DVD">DVD</MenuItem>
        <MenuItem value="Blu-Ray">Blu-Ray</MenuItem>
      </Select>
      <TextField
        label="Actors (comma separated)"
        value={manualMovie.actors}
        onChange={handleChange('actors')}
        fullWidth
      />
      <Button variant="contained" onClick={onSubmit}>Add Movie</Button>
    </Box>
  );
}
