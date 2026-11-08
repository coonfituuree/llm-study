import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { MODELS } from '../../domain/study/constants'
import { percent, signed } from '../../domain/study/format'
import type { ComparisonRow } from '../../domain/study/types'

export function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  return (
    <TableContainer>
      <Table size="small" aria-label="Complete metrics summary" sx={{ minWidth: 620 }}>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            {MODELS.map((model) => (
              <TableCell key={model} align="right">
                {model}
              </TableCell>
            ))}
            <TableCell align="right">Δ Sonnet − Sol</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const delta = row.values.some((value) => value === null)
              ? null
              : row.values[1]! - row.values[0]!
            return (
              <TableRow key={row.label} hover>
                <TableCell component="th" scope="row">
                  {row.label}
                </TableCell>
                {row.values.map((value, index) => (
                  <TableCell key={index} align="right">
                    {row.kind === 'percent' ? percent(value) : (value ?? '—')}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  {delta === null
                    ? '—'
                    : row.kind === 'percent'
                      ? `${signed(delta)} pp`
                      : `${delta > 0 ? '+' : ''}${delta}`}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
