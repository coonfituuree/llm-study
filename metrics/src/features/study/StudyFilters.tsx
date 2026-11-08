import {
  Button,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import RestartAltRounded from '@mui/icons-material/RestartAltRounded'
import { useStudy } from './useStudy'
import type { Aggregation, Difficulty, LanguageIndex, Platform } from '../../domain/study/types'

export function StudyFilters() {
  const { filters, setFilters, resetFilters } = useStudy()
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      sx={{ gap: 2, alignItems: { lg: 'end' }, my: 3 }}
      className="study-filters"
    >
      <Stack sx={{ gap: 0.75, mr: { lg: 'auto' } }}>
        <Typography variant="caption" color="text.secondary">
          Prompt language
        </Typography>
        <ToggleButtonGroup
          color="primary"
          exclusive
          size="small"
          value={filters.language}
          aria-label="Prompt language"
          onChange={(_, language: 'all' | LanguageIndex | null) => {
            if (language !== null) setFilters({ language })
          }}
        >
          <ToggleButton value="all">All languages</ToggleButton>
          <ToggleButton value={0}>KZ</ToggleButton>
          <ToggleButton value={1}>EN</ToggleButton>
          <ToggleButton value={2}>Mix</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5, flexWrap: 'wrap' }}>
        <TextField
          select
          label="Platform"
          value={filters.platform}
          onChange={(event) => setFilters({ platform: event.target.value as 'all' | Platform })}
          sx={{ minWidth: 145 }}
        >
          <MenuItem value="all">All platforms</MenuItem>
          <MenuItem value="LeetCode">LeetCode</MenuItem>
          <MenuItem value="Codeforces">Codeforces</MenuItem>
        </TextField>
        <TextField
          select
          label="Difficulty"
          value={filters.difficulty}
          onChange={(event) => setFilters({ difficulty: event.target.value as 'all' | Difficulty })}
          sx={{ minWidth: 145 }}
        >
          <MenuItem value="all">Any difficulty</MenuItem>
          {['Easy', 'Medium', 'Hard'].map((difficulty) => (
            <MenuItem key={difficulty} value={difficulty}>
              {difficulty}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Aggregation"
          value={filters.aggregation}
          onChange={(event) => setFilters({ aggregation: event.target.value as Aggregation })}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="macro">Mean across tasks</MenuItem>
          <MenuItem value="micro">Across all tests</MenuItem>
        </TextField>
        <Button
          onClick={resetFilters}
          startIcon={<RestartAltRounded />}
          sx={{ color: 'text.secondary' }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  )
}
