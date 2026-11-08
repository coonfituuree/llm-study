import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import SearchRounded from '@mui/icons-material/SearchRounded'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import { Panel } from '../components/common/Panel'
import { useStudy } from '../features/study/useStudy'
import { isComplete, parseFraction, taskRate } from '../domain/study/metrics'
import { deltaColor, percent, signed } from '../domain/study/format'
import type { ResultCell, Task } from '../domain/study/types'

type SortKey = 'id' | 'sol' | 'sonnet' | 'delta'
type Validity = 'all' | 'included' | 'excluded'

function FractionChip({ cell }: { cell: ResultCell }) {
  const parsed = parseFraction(cell.value)
  const color = !parsed.valid
    ? 'info'
    : parsed.rate === 1
      ? 'success'
      : parsed.rate === 0
        ? 'error'
        : 'warning'
  const tooltip = `${cell.address}: ${cell.value || 'empty'}${parsed.valid ? ` · ${percent(parsed.rate * 100)}` : ` · ${parsed.reason}`}${cell.recovered ? ` · restored from Excel date ${cell.raw}` : ''}`
  return (
    <Tooltip title={tooltip}>
      <Chip
        label={cell.value || '—'}
        color={color}
        variant="outlined"
        sx={{ fontSize: '0.65rem', height: 25, '& .MuiChip-label': { px: 0.8 } }}
      />
    </Tooltip>
  )
}

export default function DataPage({ onSelectTask }: { onSelectTask: (task: Task) => void }) {
  const { tasks, languages, exportCsv } = useStudy()
  const [search, setSearch] = useState('')
  const [validity, setValidity] = useState<Validity>('all')
  const [sort, setSort] = useState<SortKey>('id')
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  const rows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en-US')
    const matches = tasks.filter(
      (task) =>
        `${task.id} ${task.name}`.toLocaleLowerCase('en-US').includes(query) &&
        (validity === 'all' || isComplete(task) === (validity === 'included')),
    )
    const value = (task: Task): string | number | null =>
      sort === 'id'
        ? task.id
        : sort === 'sol'
          ? taskRate(task, 0, languages)
          : sort === 'sonnet'
            ? taskRate(task, 1, languages)
            : isComplete(task)
              ? taskRate(task, 1, languages)! - taskRate(task, 0, languages)!
              : null
    return matches.sort((a, b) => {
      const av = value(a),
        bv = value(b)
      if (av === null || bv === null) return av === null ? (bv === null ? 0 : 1) : -1
      return (
        (direction === 'asc' ? 1 : -1) *
        (typeof av === 'string' ? av.localeCompare(String(bv), 'en-US') : av - Number(bv))
      )
    })
  }, [tasks, languages, search, validity, sort, direction])
  const safePage =
    rowsPerPage === -1 ? 0 : Math.min(page, Math.max(0, Math.ceil(rows.length / rowsPerPage) - 1))
  const visibleRows =
    rowsPerPage === -1 ? rows : rows.slice(safePage * rowsPerPage, (safePage + 1) * rowsPerPage)

  function sortBy(key: SortKey) {
    setDirection(
      sort === key ? (direction === 'asc' ? 'desc' : 'asc') : key === 'id' ? 'asc' : 'desc',
    )
    setSort(key)
    setPage(0)
  }
  function sortHeading(key: SortKey, label: string) {
    return (
      <TableSortLabel
        active={sort === key}
        direction={sort === key ? direction : 'asc'}
        onClick={() => sortBy(key)}
      >
        {label}
      </TableSortLabel>
    )
  }

  return (
    <Panel
      title="From metrics to source fractions"
      eyebrow="Task explorer"
      annotation={`${rows.length} of ${tasks.length} tasks`}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        className="data-toolbar"
        sx={{ gap: 2, mb: 2 }}
      >
        <TextField
          label="Search tasks"
          placeholder="Task name or ID…"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
          }}
          type="search"
          sx={{ flex: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Data status"
          select
          value={validity}
          onChange={(event) => {
            setValidity(event.target.value as Validity)
            setPage(0)
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="included">Included</MenuItem>
          <MenuItem value="excluded">Excluded</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlined />}
          onClick={() => exportCsv(rows)}
        >
          Export matching rows
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Select a task to inspect its source values or edit results. Fractions follow the KZ · EN ·
        Mix order for each model. Hover over a fraction for its source and percentage.
      </Typography>
      <TableContainer>
        <Table size="small" aria-label="Study task results" sx={{ minWidth: 970 }}>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sort === 'id' ? direction : false}>
                {sortHeading('id', 'ID')}
              </TableCell>
              <TableCell>Task</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell align="right" sortDirection={sort === 'sol' ? direction : false}>
                {sortHeading('sol', '5.6-Sol')}
                <Typography variant="caption" sx={{ display: 'block' }}>
                  KZ · EN · Mix
                </Typography>
              </TableCell>
              <TableCell align="right" sortDirection={sort === 'sonnet' ? direction : false}>
                {sortHeading('sonnet', 'Sonnet-5.5')}
                <Typography variant="caption" sx={{ display: 'block' }}>
                  KZ · EN · Mix
                </Typography>
              </TableCell>
              <TableCell align="right" sortDirection={sort === 'delta' ? direction : false}>
                {sortHeading('delta', 'Δ, pp')}
              </TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((task) => {
              const complete = isComplete(task)
              const delta = complete
                ? taskRate(task, 1, languages)! - taskRate(task, 0, languages)!
                : null
              return (
                <TableRow hover key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell sx={{ maxWidth: 270 }}>
                    <Button
                      onClick={() => onSelectTask(task)}
                      sx={{
                        textAlign: 'left',
                        justifyContent: 'start',
                        p: 0,
                        minWidth: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {task.name}
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {task.platform}
                      {task.rating ? ` · ${task.rating}` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.difficulty}
                      color={
                        task.difficulty === 'Easy'
                          ? 'success'
                          : task.difficulty === 'Medium'
                            ? 'warning'
                            : 'error'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  {[0, 1].map((model) => (
                    <TableCell align="right" key={model}>
                      <Stack direction="row" sx={{ justifyContent: 'end', gap: 0.5 }}>
                        {task.results.slice(model * 3, model * 3 + 3).map((cell) => (
                          <FractionChip key={cell.address} cell={cell} />
                        ))}
                      </Stack>
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ color: deltaColor(delta), whiteSpace: 'nowrap' }}>
                    {signed(delta)}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      variant="outlined"
                      label={complete ? 'Included' : 'Excluded'}
                      color={complete ? 'success' : 'warning'}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
            {!rows.length && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No tasks match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ overflowX: 'auto' }}>
        <TablePagination
          component="div"
          count={rows.length}
          page={safePage}
          onPageChange={(_, next) => setPage(next)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        Δ compares mean pass rates across the selected languages. Search and status apply only to
        this table. “Export matching rows” includes every search match across all pages.
      </Typography>
    </Panel>
  )
}
