import { Box, TextField } from '@mui/material';

type MovieSearchFiltersProps = {
  titleFilter: string;
  actorFilter: string;
  onTitleChange: (value: string) => void;
  onActorChange: (value: string) => void;
}

export default function MovieSearchFilters({
  titleFilter,
  actorFilter,
  onTitleChange,
  onActorChange,
}: MovieSearchFiltersProps) {
  return (
    <>
      <h1>Search by:</h1>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Title"
          value={titleFilter}
          onChange={(e) => { onTitleChange(e.target.value); }}
          size="small"
          fullWidth
        />
        <TextField
          label="Actor"
          value={actorFilter}
          onChange={(e) => { onActorChange(e.target.value); }}
          size="small"
          fullWidth
        />
      </Box>
    </>
  );
}
