import { ChangeEvent } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

interface ImportMoviesProps {
  onSuccess?: () => void
}

export default function ImportMovies({ onSuccess }: ImportMoviesProps) {
  const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('movies', file)

    try {
      const response = await fetch('http://192.168.1.219:8000/api/v1/movies/import', {
        method: 'POST',
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwidXBkYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwiaWF0IjoxNzUzMTEzNjAzfQ.8qsVfeAyyCHgdw-M3e8ByMgMU5EY2jMftw0gJ01GAg8",

        },
        body: formData,
      })

      await response.json()
      onSuccess?.()
    } catch (err) {
      console.error('Failed to import file:', err)
    }
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

// import { ChangeEvent } from 'react'
// import { Box, Typography, IconButton } from '@mui/material'
// import UploadFileIcon from '@mui/icons-material/UploadFile'

// interface ImportMoviesProps {
//   onSuccess?: () => void
// }

// export default function ImportMovies({ onSuccess }: ImportMoviesProps) {
//   const handleFileImport = async (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     const formData = new FormData()
//     formData.append('movies', file)

//     try {
//       const response = await fetch('http://192.168.1.219:8000/api/v1/movies/import', {
//         method: 'POST',
//         headers: {
//           Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJwZXRyb0BnbWFpbC5jb20iLCJuYW1lIjoiUGV0cm92IFBldHJvIiwiY3JlYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwidXBkYXRlZEF0IjoiMjAyNS0wNy0yMVQxNjowMDowMy42ODVaIiwiaWF0IjoxNzUzMTEzNjAzfQ.8qsVfeAyyCHgdw-M3e8ByMgMU5EY2jMftw0gJ01GAg8",
//         },
//         body: formData,
//       })

//       await response.json()
//       onSuccess?.()
//     } catch (err) {
//     }
//   }

//   return (
//     <Box textAlign="center" mt={4}>
//       <Typography variant="h6" gutterBottom>
//         The list is empty
//       </Typography>
//       <Typography variant="body1" gutterBottom>
//         Please upload a text file with the films:
//       </Typography>
//       <label htmlFor="file-upload">
//         <input
//           id="file-upload"
//           type="file"
//           accept=".txt"
//           style={{ display: 'none' }}
//           onChange={handleFileImport}
//         />
//         <IconButton component="span" color="primary" size="large">
//           <UploadFileIcon fontSize="large" />
//         </IconButton>
//       </label>
//     </Box>
//   )
// }