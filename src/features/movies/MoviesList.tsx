import { useState } from 'react'
import {
  Box,
  List,
  Button,
  Select,
  Divider,
  ListItem,
  MenuItem,
  Accordion,
  TextField,
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

export default function MoviesList() {
  const { data: movies, error, isLoading, refetch } = useGetMoviesQuery()
  const [fetchMovie, { data: selectedMovie, isFetching }] = useLazyGetMovieQuery();
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [deleteMovie] = useDeleteMovieMutation()
  const [addMovie] = useAddMovieMutation()
  const [showManualForm, setShowManualForm] = useState(false)
  const [titleFilter, setTitleFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [actorFilter, setActorFilter] = useState('')
  const [sortAsc, setSortAsc] = useState(true)
  const [manualMovie, setManualMovie] = useState({
    title: '',
    year: '',
    format: '',
    actors: ''
  })

  if (isLoading) return <p>Loading...</p>

  if (error || !movies) return <p>An error occurred :|</p>

  const sortedMovies = [...movies].sort((a, b) =>
    sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  )

  const filteredMovies = sortedMovies.filter((movie) => {
    const titleMatch = movie.title.toLowerCase().includes(titleFilter.toLowerCase())
    const yearMatch = yearFilter === '' || movie.year === Number(yearFilter)
    const actorMatch =
      actorFilter === '' ||
      movie.actors?.some((actor) =>
        actor.name.toLowerCase().includes(actorFilter.toLowerCase())
      )
    return titleMatch && yearMatch && actorMatch
  })

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
      <h1>Search by: </h1>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Actor"
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value)}
          size="small"
          fullWidth
        />
      </Box>

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
      <ImportMovies onSuccess={refetch} />
      {showManualForm && (
        <Box display="flex" flexDirection="column" gap={2} mb={3}>
          <TextField
            label="Title"
            value={manualMovie.title}
            onChange={(e) => setManualMovie({ ...manualMovie, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Year"
            value={manualMovie.year}
            onChange={(e) => setManualMovie({ ...manualMovie, year: e.target.value })}
            fullWidth
          />
          <Select
            value={manualMovie.format}
            onChange={(e) => setManualMovie({ ...manualMovie, format: e.target.value as string })}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select format
            </MenuItem>
            <MenuItem value="VHS">VHS</MenuItem>
            <MenuItem value="DVD">DVD</MenuItem>
            <MenuItem value="Blu-Ray">Blu-Ray</MenuItem>
          </Select>
          <TextField
            label="Actors (comma separated)"
            value={manualMovie.actors}
            onChange={(e) => setManualMovie({ ...manualMovie, actors: e.target.value })}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddManualMovie}>
            Add Movie
          </Button>
        </Box>
      )}

      {movies.length === 0 ? (
        <>
          <Typography>The list is empty. Please upload a text file with the films:</Typography>
          <ImportMovies onSuccess={refetch} />
        </>
      ) : filteredMovies.length === 0 ? (
        <Typography>No movies found for your search</Typography>
      ) : (
        <List>
          {filteredMovies.map((movie) => (
            <Accordion
              key={movie.id}
              expanded={expandedId === movie.id}
              onChange={(_, isExpanded) => {
                setExpandedId(isExpanded ? movie.id : null);
                if (isExpanded) fetchMovie(Number(movie.id));
              }}
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls={`panel-${movie.id}-content`}
                id={`panel-${movie.id}-header`}
              >
                <Typography component="span" sx={{ flexGrow: 1 }}>
                  {movie.title}
                </Typography>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMovie(movie.id);
                  }}
                  sx={{ marginLeft: 'auto' }}
                >
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>
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
    </Box>
  )
}