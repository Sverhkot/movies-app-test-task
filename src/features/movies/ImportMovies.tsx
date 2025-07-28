import { useState, type ChangeEvent } from 'react'

import { styled } from '@mui/material/styles'
import { Box, Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { useImportMoviesMutation } from './apiSlice'

type ImportMoviesProps = {
  onSuccess?: () => Promise<unknown>
  onError?: () => Promise<unknown>
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ImportMovies({ onSuccess, onError }: ImportMoviesProps) {
  const [importMovies] = useImportMoviesMutation()
  const [, setErrorMessage] = useState('')

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  setErrorMessage('')

  if (!file) return

  
  const formData = new FormData()
  formData.append('movies', file)
  
  importMovies(formData).unwrap()
  .then(() => {
    if (file.size === 0) {
      setErrorMessage('The file is empty.')
      void onError?.()
      return
    }
    void onSuccess?.()
    })
    .catch((err: unknown) => {
      console.error('Failed to import file:', err)
    })
}

  return (
    <>
    <Box textAlign="center" mt={2} mb={4}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileImport}
          />
        </Button>
      </Box>
    </>
  )
}