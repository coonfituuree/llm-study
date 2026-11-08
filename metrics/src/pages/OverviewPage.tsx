import { MODEL_COLORS, OUTCOME_COLORS } from '../app/theme'
import { useMemo } from 'react'
import {
  Alert,
  Box,
  ButtonBase,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { Panel } from '../components/common/Panel'
import { MetricCard } from '../components/common/MetricCard'
import { ModelLegend } from '../components/common/ModelLegend'
import { ComparisonTable } from '../components/common/ComparisonTable'
import { ALL_LANGUAGES, EPSILON, LANGUAGES, MODELS } from '../domain/study/constants'
import { deltaColor, formatNumber, percent, signed } from '../domain/study/format'
import {
  getDifficultyMetrics,
  getLanguageMetrics,
  getMixRankings,
  getPlatformMetrics,
  getSummaryRows,
  getTaskRankings,
} from '../domain/study/selectors'
import type { Task } from '../domain/study/types'
import { useStudy } from '../features/study/useStudy'

interface RankingRow {
  task: Task
  delta: number
  detail: string
}

function TaskRanking({
  rows,
  onSelectTask,
  empty,
}: {
  rows: RankingRow[]
  onSelectTask: (task: Task) => void
  empty: string
}) {
  if (!rows.length)
    return (
      <Alert severity="info" icon={false}>
        {empty}
      </Alert>
    )
  return (
    <Stack divider={<Divider />}>
      {rows.map((row, index) => (
        <Stack key={row.task.id} direction="row" sx={{ gap: 1.5, alignItems: 'center', py: 1.75 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', minWidth: 16 }}>
            {String(index + 1).padStart(2, '0')}
          </Typography>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ButtonBase
              onClick={() => onSelectTask(row.task)}
              sx={{
                display: 'block',
                textAlign: 'left',
                maxWidth: '100%',
                borderRadius: 0.5,
                '&:hover': { color: 'primary.main' },
              }}
            >
              <Typography variant="body2" noWrap>
                {row.task.name}
              </Typography>
            </ButtonBase>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4 }}>
              {row.detail}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: deltaColor(row.delta),
              whiteSpace: 'nowrap',
            }}
          >
            {signed(row.delta)}{' '}
            <Box component="span" sx={{ fontWeight: 400, fontSize: 10 }}>
              pp
            </Box>
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export default function OverviewPage({ onSelectTask }: { onSelectTask: (task: Task) => void }) {
  const { tasks, languages, filters, metrics, setFilters } = useStudy()
  const languageMetrics = useMemo(
    () => getLanguageMetrics(tasks, filters.aggregation),
    [tasks, filters.aggregation],
  )
  const difficulties = useMemo(
    () => getDifficultyMetrics(tasks, languages, filters.aggregation),
    [tasks, languages, filters.aggregation],
  )
  const platforms = useMemo(
    () => getPlatformMetrics(tasks, languages, filters.aggregation),
    [tasks, languages, filters.aggregation],
  )
  const summary = useMemo(
    () => getSummaryRows(metrics, languageMetrics),
    [metrics, languageMetrics],
  )
  const rankings = getTaskRankings(metrics.included, languages)
  const mixRankings = getMixRankings(metrics.included)
  const largest = [...difficulties]
    .filter((group) => group.n)
    .sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!))[0]
  const languageMeans = languageMetrics.map((result) =>
    result.n ? (result.models[0].rate! + result.models[1].rate!) / 2 : null,
  )
  const bestValue = metrics.n ? Math.max(...languageMeans.map((value) => value ?? 0)) : null
  const bestLanguages = LANGUAGES.filter(
    (_, index) => bestValue !== null && Math.abs(languageMeans[index]! - bestValue) < EPSILON,
  )
  const partialCount = metrics.models.reduce((sum, model) => sum + model.partial, 0)
  const cellCount = metrics.models.reduce((sum, model) => sum + model.cells, 0)
  const winGroups = [
    { key: 'sonnet', label: 'Sonnet wins', color: MODEL_COLORS[1] },
    { key: 'equal', label: 'Tied', color: 'grey.300' },
    { key: 'sol', label: 'Sol wins', color: MODEL_COLORS[0] },
  ] as const

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2} aria-live="polite">
        {metrics.models.map((model, index) => (
          <Grid key={model.name} size={{ xs: 6, xl: 3 }}>
            <MetricCard
              label={model.name}
              value={formatNumber(model.rate)}
              unit={metrics.n ? '%' : undefined}
              description={`${model.fullTasks} of ${metrics.n} tasks · 100% in selected languages`}
              color={MODEL_COLORS[index]}
              featured={index === 1}
            />
          </Grid>
        ))}
        <Grid size={{ xs: 6, xl: 3 }}>
          <MetricCard
            label="Model difference"
            value={signed(metrics.delta)}
            unit={metrics.n ? 'pp' : undefined}
            description="Sonnet-5.5 − 5.6-Sol"
          />
        </Grid>
        <Grid size={{ xs: 6, xl: 3 }}>
          <MetricCard
            label="Included tasks"
            value={String(metrics.n).padStart(2, '0')}
            description={`${cellCount} cells · ${metrics.excluded.length} tasks excluded`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Panel
            title="Performance by language"
            eyebrow="01 / Prompt language"
            annotation="Pass rate, %"
          >
            <ModelLegend />
            <BarChart
              height={280}
              borderRadius={4}
              hideLegend
              skipAnimation
              xAxis={[{ data: [...LANGUAGES], scaleType: 'band', categoryGapRatio: 0.5 }]}
              yAxis={[
                { min: 0, max: 100, valueFormatter: (value: number) => `${value}%`, width: 42 },
              ]}
              series={MODELS.map((name, model) => ({
                id: name,
                label: name,
                color: MODEL_COLORS[model],
                data: languageMetrics.map((result) => result.models[model].rate),
                valueFormatter: (value) => percent(value),
              }))}
              grid={{ horizontal: true }}
              margin={{ top: 15, bottom: 28, left: 0, right: 5 }}
              onItemClick={(_, item) => setFilters({ language: ALL_LANGUAGES[item.dataIndex] })}
              sx={{
                '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: 'rgba(0, 0, 0, 0.12)' },
              }}
            />
            <Divider />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', pt: 1.5 }}>
              {metrics.n ? (
                <>
                  Best mean result:{' '}
                  <Box component="strong" sx={{ color: 'primary.main' }}>
                    {bestLanguages.join(', ')} · {percent(bestValue)}
                  </Box>{' '}
                  across both models. All languages are shown for context. Select a bar to filter.
                </>
              ) : (
                'No complete tasks to compare.'
              )}
            </Typography>
          </Panel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Panel
            title="Difficulty matters"
            eyebrow="02 / Task difficulty"
            annotation="Pass rate, %"
          >
            <ModelLegend />
            <BarChart
              height={280}
              layout="horizontal"
              borderRadius={4}
              hideLegend
              skipAnimation
              yAxis={[
                {
                  data: difficulties.map((group) => `${group.name} · ${group.n}`),
                  scaleType: 'band',
                  width: 88,
                },
              ]}
              xAxis={[{ min: 0, max: 100, valueFormatter: (value: number) => `${value}%` }]}
              series={MODELS.map((name, model) => ({
                id: name,
                label: name,
                color: MODEL_COLORS[model],
                data: difficulties.map((group) => group.models[model].rate),
                valueFormatter: (value) => percent(value),
              }))}
              grid={{ vertical: true }}
              margin={{ top: 10, left: 0, right: 20, bottom: 28 }}
            />
            <Alert icon={false} severity="info" sx={{ fontSize: 12 }}>
              {largest ? (
                <>
                  Largest difference:{' '}
                  <strong>
                    {largest.name} · {signed(largest.delta)} pp
                  </strong>{' '}
                  across {largest.n} tasks.
                </>
              ) : (
                'No complete tasks in this selection.'
              )}
            </Alert>
          </Panel>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel
            title="Task-level comparison"
            eyebrow="03 / Head to head"
            annotation="Sonnet − Sol"
          >
            <Box
              role="img"
              aria-label={winGroups
                .map((group) => `${group.label}: ${metrics.wins[group.key]}`)
                .join(', ')}
              sx={{
                display: 'flex',
                height: 14,
                borderRadius: 1,
                overflow: 'hidden',
                gap: '3px',
                mt: 4,
                mb: 3,
              }}
            >
              {winGroups.map((group) => (
                <Box
                  key={group.key}
                  sx={{
                    width: `${metrics.n ? (metrics.wins[group.key] / metrics.n) * 100 : 0}%`,
                    bgcolor: group.color,
                  }}
                />
              ))}
            </Box>
            <Grid container spacing={1}>
              {winGroups.map((group) => (
                <Grid size={4} key={group.key}>
                  <Typography sx={{ fontSize: 30, fontWeight: 500, letterSpacing: '-1px' }}>
                    {metrics.wins[group.key]}
                  </Typography>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '1px', bgcolor: group.color }} />
                    <Typography variant="caption" color="text.secondary">
                      {group.label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2.5 }}>
              Compares the mean across{' '}
              {languages.length === 1 ? LANGUAGES[languages[0]] : 'all three languages'} for each
              task. The unit of analysis is a task, in both aggregation modes.
            </Typography>
          </Panel>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel title="Beyond the average" eyebrow="04 / Test outcomes" annotation="Cell counts">
            <BarChart
              height={180}
              layout="horizontal"
              borderRadius={3}
              skipAnimation
              yAxis={[{ data: [...MODELS], scaleType: 'band', width: 87 }]}
              xAxis={[{ min: 0, max: metrics.models[0].cells || 1 }]}
              series={[
                {
                  label: '100% of tests',
                  color: OUTCOME_COLORS[0],
                  stack: 'outcomes',
                  data: metrics.models.map((model) => model.full),
                },
                {
                  label: 'Some tests',
                  color: OUTCOME_COLORS[1],
                  stack: 'outcomes',
                  data: metrics.models.map((model) => model.partial),
                },
                {
                  label: '0% of tests',
                  color: OUTCOME_COLORS[2],
                  stack: 'outcomes',
                  data: metrics.models.map((model) => model.zero),
                },
              ]}
              margin={{ left: 0, right: 20, top: 8, bottom: 20 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Partial results:{' '}
              {metrics.models
                .map((model) => `${model.name} ${percent(model.partialRate)}`)
                .join(' · ')}
              . Cells per model: {metrics.models[0].cells}.
            </Typography>
          </Panel>
        </Grid>
      </Grid>

      <Panel title="Platforms and ratings" eyebrow="05 / Breakdown" annotation="Current selection">
        <TableContainer>
          <Table size="small" aria-label="Metrics by platform and rating" sx={{ minWidth: 480 }}>
            <TableHead>
              <TableRow>
                <TableCell>Task group</TableCell>
                <TableCell align="right">n</TableCell>
                {MODELS.map((model) => (
                  <TableCell key={model} align="right">
                    {model}
                  </TableCell>
                ))}
                <TableCell align="right">Δ, pp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {platforms.map((group) => (
                <TableRow hover key={group.name}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      pl: group.sub ? 3.5 : 2,
                      color: group.sub ? 'text.secondary' : 'text.primary',
                    }}
                  >
                    {group.name}
                  </TableCell>
                  <TableCell align="right">{group.n}</TableCell>
                  {group.models.map((model) => (
                    <TableCell align="right" key={model.name}>
                      {percent(model.rate)}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ color: deltaColor(group.delta) }}>
                    {signed(group.delta)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel
            title="Where models diverge"
            eyebrow="06 / Largest differences"
            annotation="Top 5 by |Δ|"
          >
            <TaskRanking
              rows={rankings.map((row) => ({
                ...row,
                detail: `${row.task.id} · ${percent(row.sol)} → ${percent(row.sonnet)}`,
              }))}
              onSelectTask={onSelectTask}
              empty="No tasks in the selected group."
            />
          </Panel>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Panel
            title="Where Mix falls behind"
            eyebrow="07 / Language effect"
            annotation="Mix − (KZ + EN) / 2"
          >
            <TaskRanking
              rows={mixRankings.map((row) => ({
                ...row,
                detail: `${row.task.id} · ${row.task.difficulty}`,
              }))}
              onSelectTask={onSelectTask}
              empty="No tasks in this group have a lower Mix result."
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Uses all three languages and both models, regardless of the language filter.
              Differences are in percentage points.
            </Typography>
          </Panel>
        </Grid>
      </Grid>

      <Panel
        title="Complete results summary"
        eyebrow="08 / Complete metrics"
        annotation="Current selection"
      >
        <ComparisonTable rows={summary} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Partial results across both models:{' '}
          {cellCount ? percent((partialCount / cellCount) * 100) : '—'} ({partialCount} of{' '}
          {cellCount} cells). KZ / EN / Mix rows use all languages for the same task selection;
          other rows follow the language filter.
        </Typography>
      </Panel>
    </Stack>
  )
}
