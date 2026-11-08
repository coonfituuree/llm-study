import { useMemo } from 'react'
import {
  Alert,
  Box,
  Chip,
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
import { Panel } from '../components/common/Panel'
import { calculateMetrics, parseFraction } from '../domain/study/metrics'
import { formatNumber, percent } from '../domain/study/format'
import { getReportChecks } from '../domain/study/selectors'
import type { ReportCheck } from '../domain/study/types'
import { useStudy } from '../features/study/useStudy'

const methods = [
  {
    title: 'Pass rate',
    description: 'For each task, model and language:',
    formula: (
      <>
        r<sub>t,m,l</sub> = passed / total
      </>
    ),
    note: 'For example, 5/12 = 41.67%. Values are rounded for display only.',
  },
  {
    title: 'Mean across tasks',
    description:
      'The default mode matches the PDF. Each task and each selected language has equal weight.',
    formula: <>Macro = 100 × Σ r / (n × L)</>,
    note: 'n is the number of complete tasks; L is the number of selected languages.',
  },
  {
    title: 'Mean across all tests',
    description: 'An alternative mode: tasks with more tests carry more weight.',
    formula: <>Micro = 100 × Σ passed / Σ total</>,
    note: 'Results may therefore differ from the PDF. This is a separate aggregation method.',
  },
  {
    title: 'Paired comparison',
    description:
      'Δ = Sonnet − Sol, in percentage points. Task wins compare mean pass rates across the selected languages.',
    formula: (
      <>
        Δ<sub>t</sub> = 100 × mean(r<sub>Sonnet</sub> − r<sub>Sol</sub>)
      </>
    ),
    note: 'Differences below 10⁻⁹ percentage points count as ties. These are descriptive statistics, without significance testing.',
  },
]

function checkValue(value: ReportCheck['actual'], kind: ReportCheck['kind']) {
  if (value === null) return '—'
  return typeof value === 'string'
    ? value
    : kind === 'percent'
      ? percent(value)
      : kind === 'decimal'
        ? formatNumber(value)
        : value
}

export default function MethodologyPage() {
  const { dataset } = useStudy()
  const all = useMemo(() => calculateMetrics(dataset.tasks), [dataset.tasks])
  const checks = useMemo(() => getReportChecks(dataset.tasks), [dataset.tasks])
  const recovered = dataset.tasks.reduce(
    (sum, task) => sum + task.results.filter((cell) => cell.recovered).length,
    0,
  )
  const quality = [
    {
      count: recovered,
      title: 'Fractions restored from Excel dates',
      description:
        'The d/m format converts a date serial back to day/month. For example, 46084 → 3/3; T059: 46361 → 5/12. This restores the displayed value; the original input before Excel conversion is unknown. Each cell source is available in the task details.',
    },
    {
      count: all.excluded.length,
      title: 'Incomplete tasks excluded',
      description: all.excluded.length
        ? `${all.excluded
            .map(
              (task) =>
                `${task.id} (${task.results
                  .filter((cell) => !parseFraction(cell.value).valid)
                  .map((cell) => cell.address)
                  .join(', ')})`,
            )
            .join(
              '; ',
            )}. At least one denominator or result is missing. Unknown values are not replaced with zero; the entire task is excluded from both models.`
        : 'All tasks contain six valid fractions.',
    },
    {
      count: all.n,
      title: 'Paired tasks in the full dataset',
      description: `${all.n} × 3 languages × 2 models = ${all.n * 6} observations. Filters update the sample size. The dataset contains no repeated runs or independent replications.`,
    },
  ]

  return (
    <Stack spacing={2.5}>
      <Box sx={{ maxWidth: 590, pb: 1 }}>
        <Typography variant="overline" color="text.secondary">
          Reproducible by design
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 32, md: 40 },
            letterSpacing: '-1.5px',
            fontWeight: 500,
            lineHeight: 1.2,
            my: 2,
          }}
        >
          Data first.
          <br />
          Conclusions follow.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Every number is calculated from test results. The PDF is used for comparison; the
          spreadsheet supplies the observations.
        </Typography>
      </Box>
      <Grid container spacing={2.5}>
        {methods.map((method, index) => (
          <Grid key={method.title} size={{ xs: 12, md: 6 }}>
            <Panel title={method.title} eyebrow={`0${index + 1} / Calculation`}>
              <Typography variant="body2" color="text.secondary">
                {method.description}
              </Typography>
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  my: 2,
                  p: { xs: 1.5, sm: 2 },
                  fontFamily: 'Georgia, serif',
                  fontSize: { xs: 17, sm: 20 },
                  color: 'primary.main',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                }}
              >
                {method.formula}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {method.note}
              </Typography>
            </Panel>
          </Grid>
        ))}
      </Grid>
      <Panel title="How the spreadsheet is processed" eyebrow="Data quality">
        <Stack sx={{ gap: 3 }}>
          {quality.map((item) => (
            <Stack key={item.title} direction="row" sx={{ gap: 2 }}>
              <Typography
                sx={{ fontSize: 27, fontWeight: 500, color: 'primary.main', minWidth: 44 }}
              >
                {item.count}
              </Typography>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
        <Alert severity="info" icon={false} sx={{ mt: 3 }}>
          A fully solved task passes 100% of tests in every selected language. A partial result
          means 0 &lt; passed &lt; total. A cell is a task × model × language observation. Complete
          tasks require all six results, even when only one language is selected.
        </Alert>
      </Panel>
      <Panel
        title="Comparison with the original PDF"
        eyebrow="Report cross-check"
        annotation="Full dataset · Macro"
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Checks the entire loaded dataset without filters. PDF values are references; calculations
          always use the current data.
        </Typography>
        <TableContainer>
          <Table size="small" aria-label="PDF reference comparison" sx={{ minWidth: 590 }}>
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell align="right">PDF</TableCell>
                <TableCell align="right">From spreadsheet</TableCell>
                <TableCell align="right">Comparison</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checks.map((check) => (
                <TableRow hover key={check.label}>
                  <TableCell component="th" scope="row">
                    {check.label}
                  </TableCell>
                  <TableCell align="right">{checkValue(check.expected, check.kind)}</TableCell>
                  <TableCell align="right">{checkValue(check.actual, check.kind)}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={check.matches ? '✓ Matches' : '≠ Differs'}
                      color={check.matches ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Panel>
      <Panel title="Interpretation limits" eyebrow="Study scope">
        <Typography variant="body2" color="text.secondary">
          This dataset contains {dataset.tasks.length} tasks with one result per model × language
          pair. The mean fraction of passed tests is neither the probability of solving a new task
          nor a pass@k metric. Differences depend on difficulty, platform and test coverage; a
          causal language effect and statistical significance have not been established.
        </Typography>
      </Panel>
    </Stack>
  )
}
