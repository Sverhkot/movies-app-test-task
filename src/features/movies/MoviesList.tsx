import { useState } from 'react'
import {
  Box,
  List,
  Button,
  Divider,
  ListItem,
  Accordion,
  IconButton,
  Typography,
  AccordionDetails,
  AccordionSummary,
  CircularProgress
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useGetMoviesQuery, useDeleteMovieMutation, useAddMovieMutation, useLazyGetMovieQuery, MovieInput } from './apiSlice'
import ImportMovies from './importMovies'
import MovieSearchFilters from './MovieSearchFilters';
import ManualMovieForm from './ManualMovieForm'

export default function MoviesList() {
  const [fetchMovie, { data: selectedMovie, isFetching }] = useLazyGetMovieQuery();
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [deleteMovie] = useDeleteMovieMutation()
  const [addMovie] = useAddMovieMutation()
  const [showManualForm, setShowManualForm] = useState(false)
  const [titleFilter, setTitleFilter] = useState('')
  const [actorFilter, setActorFilter] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [manualMovie, setManualMovie] = useState({
    title: '',
    year: '',
    format: '',
    actors: ''
  })
  const { data: movies, isLoading, error, refetch } = useGetMoviesQuery({
    title: titleFilter,
    actor: actorFilter,
    sort: 'year',
    order: 'DESC',
    limit: 100
  })

  if (isLoading) return <p>Loading...</p>

  if (error) return <p style={{ color: 'red' }}>An error occurred :|</p>;

  const visibleMovies = [...(movies ?? [])].sort((a, b) =>
    sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  )

  const handleAddManualMovie = async () => {
    if (!manualMovie.title || !manualMovie.year || !manualMovie.format) {
      console.error('Please fill in all required fields');
      return;
    }

    try {
      const capitalizeName = (name: string) => {
        return name
          .split(' ')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(' ');
      };

      const newMovie: MovieInput = {
        title: manualMovie.title.trim(),
        year: Number(manualMovie.year),
        format: manualMovie.format as 'VHS' | 'DVD' | 'Blu-Ray',
        actors: manualMovie.actors
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0)
          .map(capitalizeName),
      };

      await addMovie(newMovie).unwrap()
      await refetch()

      setManualMovie({ title: '', year: '', format: '', actors: '' })
      setShowManualForm(false)
    } catch (error) {
      console.error('Failed to add movie:', error)
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

      <h1>Movies collection</h1>
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => setSortAsc((prev) => !prev)}
      >
        Sort by title: {sortAsc ? 'A → Z' : 'Z → A'}
      </Button>
      <Button
        variant="outlined"
        onClick={() => setShowManualForm((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {showManualForm ? 'Cancel' : 'Create your own movie manually'}
      </Button>

      {showManualForm && (
        <ManualMovieForm
          manualMovie={manualMovie}
          setManualMovie={setManualMovie}
          onSubmit={handleAddManualMovie}
        />
      )}
      {!movies || movies.length === 0 ? (
        <Box textAlign="center">
          <Typography>The list is empty.</Typography>
          <Typography>Add movie manually</Typography>
          <ImportMovies onSuccess={refetch} />
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
                setExpandedId(isExpanded ? movie.id : null);
                if (isExpanded) fetchMovie(Number(movie.id));
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls={`panel-${movie.id}-content`}
                    id={`panel-${movie.id}-header`}
                    sx={{ flexGrow: 1 }} 
                >
                    <Typography component="span">
                        {movie.title}
                    </Typography>
                </AccordionSummary>

                <IconButton
                    aria-label="delete"
                    onClick={() => {
                        deleteMovie(movie.id);
                    }}
                    sx={{ mr: 1 }} 
                >
                    <DeleteIcon />
                </IconButton>
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
                      Actors: {selectedMovie.actors && selectedMovie.actors.length > 0 
                        ? selectedMovie.actors?.map(actor => actor.name).join(', ') 
                        : 'N/A'}
                    </ListItem>
                  </List>
                ) : null}
              </AccordionDetails>
            </Accordion>
          ))}
        </List>
      )}
    </Box>
  )
}