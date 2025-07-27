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

import type { MovieInput } from './apiSlice'
import ImportMovies from './ImportMovies'
import ManualMovieForm from './ManualMovieForm'
import DeleteMovieDialog from './DeleteMovieDialog'
import MovieSearchFilters from './MovieSearchFilters'
import { useGetMoviesQuery, useAddMovieMutation, useLazyGetMovieQuery } from './apiSlice'

export default function MoviesList() {
  const [addMovie] = useAddMovieMutation()
  const [sortAsc, setSortAsc] = useState(true)
  const [titleFilter, setTitleFilter] = useState('')
  const [actorFilter, setActorFilter] = useState('')
  const [showManualForm, setShowManualForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | number | null>(null)
  const [fetchMovie, { data: selectedMovie, isFetching }] = useLazyGetMovieQuery()
  const [manualMovie, setManualMovie] = useState({
    title: '',
    year: '',
    format: '',
    actors: ''
  })
  const { data: movies, error, refetch } = useGetMoviesQuery({
    title: titleFilter,
    actor: actorFilter,
    sort: 'year',
    order: 'DESC',
    limit: 100
  })

  if (error) return <p style={{ color: 'red' }}>An error occurred :|</p>

  const visibleMovies = [...(movies ?? [])].sort((a, b) =>
    sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  )

  const handleDeleteSuccess = async () => {
    setSuccessMessage('Movie deleted successfully')
    await refetch()
  }

  const handleAddManualMovie = async () => {
    if (!manualMovie.title || !manualMovie.year || !manualMovie.format) {
      console.error('Please fill in all required fields')
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
      format: manualMovie.format as 'VHS' | 'DVD' | 'Blu-Ray',
      actors: manualMovie.actors
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(capitalizeName),
    }

    try {
      await addMovie(newMovie).unwrap()
      await refetch()
      setManualMovie({ title: '', year: '', format: '', actors: '' })
      setShowManualForm(false)
      setSuccessMessage('Movie added successfully')
    } catch (error) {
      console.error('Failed to add movie:', error)
      setErrorMessage('Failed to add movie')
    }
  }

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', p: 2 }} bgcolor="#f9f9f9">
      <MovieSearchFilters
        titleFilter={titleFilter}
        actorFilter={actorFilter}
        onTitleChange={setTitleFilter}
        onActorChange={setActorFilter}
      />

      <h1 style={{textAlign: 'center'}}>Movies collection</h1>

      <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => { setSortAsc((prev) => !prev) }}
        >
          Sort by title: {sortAsc ? 'A → Z' : 'Z → A'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => { setShowManualForm((prev) => !prev) }}
          sx={{ mb: 2 }}
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
          manualMovie={manualMovie}
          setManualMovie={setManualMovie}
          onSubmit={async () => {
            await handleAddManualMovie()
          }}
          onSuccess={async () => {
            setSuccessMessage('Movie added successfully')
            await refetch()
          }}
          onError={async () => {
            setErrorMessage('Failed to add movie')
            await refetch()
          }}
        />
      )}
      {!movies || movies.length === 0 ? (
        <Box textAlign="center">
          <Typography>The list is empty.</Typography>
          <Typography>Add movie manually</Typography>
          <Typography variant="body1" gutterBottom>
            Or upload a text file with your movie collection
          </Typography>
        </Box>
      ) : visibleMovies.length === 0 ? (
        <Typography>No movies found for your search</Typography>
      ) : (
        <List>
          {visibleMovies.map((movie) => (
            <Accordion
              key={movie.id}
              expanded={expandedId === movie.id}
              onChange={(_, isExpanded) => {
                setExpandedId(isExpanded ? movie.id : null)
                if (isExpanded) { 
                  fetchMovie(Number(movie.id))
                  .catch(() => { console.error('Failed to fetch movie details') })
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <AccordionSummary
                  sx={{ flexGrow: 1 }}
                  id={`panel-${movie.id}-header`}
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls={`panel-${movie.id}-content`}
                >
                  <Typography component="span">
                    {movie.title}
                  </Typography>
                </AccordionSummary>
                <DeleteMovieDialog movieId={movie.id} onSuccess={handleDeleteSuccess}/>
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
                      Actors: {selectedMovie.actors.length > 0
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
