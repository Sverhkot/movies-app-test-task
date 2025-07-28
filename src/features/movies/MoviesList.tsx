import { useState } from 'react'

import {
  Box,
  List,
  Alert,
  Button,
  Divider,
  Snackbar,
  ListItem,
  Accordion,
  Typography,
  AccordionDetails,
  AccordionSummary,
  CircularProgress
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import ImportMovies from './ImportMovies'
import ManualMovieForm from './ManualMovieForm'
import DeleteMovieDialog from './DeleteMovieDialog'
import MovieSearchFilters from './MovieSearchFilters'
import { useGetMoviesQuery, useLazyGetMovieQuery } from './apiSlice'

export default function MoviesList() {
  const [sortAsc, setSortAsc] = useState(true)
  const [titleFilter, setTitleFilter] = useState('')
  const [actorFilter, setActorFilter] = useState('')
  const [showManualForm, setShowManualForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | number | null>(null)
  const [fetchMovie, { data: selectedMovie, isFetching }] = useLazyGetMovieQuery()

  const { data: movies, error, refetch } = useGetMoviesQuery({
    title: titleFilter,
    actor: actorFilter,
    sort: 'year',
    order: 'DESC',
    limit: 100
  })

  if (error) {
    return <Typography color="error">An error occurred :|</Typography>
  }

  const visibleMovies = [...(movies ?? [])].sort((a, b) =>
    sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  )

  const handleDeleteSuccess = async () => {
    setSuccessMessage('Movie deleted successfully')
    await refetch()
  }

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', p: 2 }} bgcolor="#f9f9f9">
      <MovieSearchFilters
        titleFilter={titleFilter}
        actorFilter={actorFilter}
        onTitleChange={setTitleFilter}
        onActorChange={setActorFilter}
      />

      <Typography variant="h4" textAlign="center" gutterBottom>
        Movies collection
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginBottom: '20px'
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {setSortAsc(prev => !prev)}}
        >
          Sort by title: {sortAsc ? 'A → Z' : 'Z → A'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {setShowManualForm(prev => !prev)}}
        >
          {showManualForm ? 'Cancel' : 'Add movie manually'}
        </Button>
        <ImportMovies
          onSuccess={async () => {
            setSuccessMessage('Movies imported successfully')
            await refetch()
          }}
          onError={async () => {
            setErrorMessage('The file is empty')
            await refetch()
          }}
        />
      </Box>

      {showManualForm && (
        <ManualMovieForm
          onSuccess={async () => {
            setSuccessMessage('Movie added successfully')
            await refetch()
            setShowManualForm(false)
          }}
          onError={() => {
            setErrorMessage('Failed to add movie')
          }}
        />
      )}

      {!movies || movies.length === 0 ? (
        <Box textAlign="center" mt={3}>
          <Typography>The list is empty.</Typography>
          <Typography>Add movie manually</Typography>
          <Typography variant="body1" gutterBottom>
            Or upload a text file with your movie collection
          </Typography>
        </Box>
      ) : visibleMovies.length === 0 ? (
        <Typography mt={3}>No movies found for your search</Typography>
      ) : (
        <List>
          {visibleMovies.map((movie) => (
            <Accordion
              key={movie.id}
              expanded={expandedId === movie.id}
              onChange={(_, isExpanded) => {
                setExpandedId(isExpanded ? movie.id : null)
                if (isExpanded) {
                  fetchMovie(Number(movie.id)).catch(() => {
                    console.error('Failed to fetch movie details')
                  })
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <AccordionSummary
                  sx={{ flexGrow: 1 }}
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls={`panel-${movie.id}-content`}
                  id={`panel-${movie.id}-header`}
                >
                  <Typography>{movie.title}</Typography>
                </AccordionSummary>
                <DeleteMovieDialog movieId={movie.id} onSuccess={handleDeleteSuccess} />
              </Box>
              <AccordionDetails>
                {isFetching ? (
                  <CircularProgress />
                ) : selectedMovie?.id === movie.id ? (
                  <List disablePadding>
                    <Divider component="li" />
                    <ListItem>Year: {movie.year}</ListItem>
                    <Divider variant="middle" component="li" />
                    <ListItem>Format: {movie.format}</ListItem>
                    <Divider variant="middle" component="li" />
                    <ListItem>
                      Actors:{' '}
                      {selectedMovie.actors.length > 0
                        ? selectedMovie.actors.map(actor => actor.name).join(', ')
                        : 'N/A'}
                    </ListItem>
                  </List>
                ) : null}
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => {setSuccessMessage(null)}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          sx={{ width: '100%' }}
          severity="success"
          variant="filled"
          onClose={() => {setSuccessMessage(null)}}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => {setErrorMessage(null)}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          sx={{ width: '100%' }}
          severity="error"
          variant="filled"
          onClose={() => {setErrorMessage(null)}}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
