import { Box, TextField } from '@mui/material'

type MovieSearchFiltersProps = {
  titleFilter: string
  actorFilter: string
  onTitleChange: (value: string) => void
  onActorChange: (value: string) => void
}

export default function MovieSearchFilters({
  titleFilter,
  actorFilter,
  onTitleChange,
  onActorChange,
}: MovieSearchFiltersProps) {
  const allowedActorChars = /^[a-zA-Zа-яА-ЯёЁ\s,.-]*$/

  const handleActorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    if (newValue === '' || allowedActorChars.test(newValue)) {
      onActorChange(newValue)
    }
  }

  return (
    <>
      <h1 style={{textAlign: 'center'}}>Search by:</h1>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          size="small"
          label="Title"
          value={titleFilter}
          onChange={(e) => { onTitleChange(e.target.value) }}
        />
        <TextField
          fullWidth
          size="small"
          label="Actor"
          value={actorFilter}
          onChange={handleActorChange}
        />
      </Box>
    </>
  )
}
