import type { ChangeEvent } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useImportMoviesMutation } from './apiSlice'

type ImportMoviesProps = {
  onSuccess?: () => Promise<unknown>
}

export default function ImportMovies({ onSuccess }: ImportMoviesProps) {
  const [importMovies] = useImportMoviesMutation()

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('movies', file)

  importMovies(formData).unwrap()
    .then(() => {
      void onSuccess?.()
    })
    .catch((err: unknown) => {
      console.error('Failed to import file:', err)
    })
}

  return (
    <Box textAlign="center" mt={2} mb={4}>
      <Typography variant="body1" gutterBottom>
        Or upload a text file with your movie collection:
      </Typography>
      <label htmlFor="file-upload">
        <input
          id="file-upload"
          type="file"
          accept=".txt"
          style={{ display: 'none' }}
          onChange={handleFileImport}
        />
        <IconButton component="span" color="primary" size="large">
          <UploadFileIcon fontSize="large" />
        </IconButton>
      </label>
    </Box>
  )
}
