import { LANGUAGES } from '../domain/study/constants'
import {
  calculateMetrics,
  getLanguages,
  isComplete,
  mixGap,
  taskRate,
} from '../domain/study/metrics'
import type { StudyDataset, StudyFilters, Task } from '../domain/study/types'

type CsvValue = string | number | boolean | null

function csvCell(value: CsvValue): string {
  const text = String(value ?? '')
  const prefix = typeof value === 'string' && /^\s*[=+@-]/.test(text) ? "'" : ''
  return `"${prefix}${text.replace(/"/g, '""')}"`
}

export function exportStudyCsv(
  dataset: StudyDataset,
  rows: Task[],
  filters: StudyFilters,
  edited: boolean,
): void {
  const languages = getLanguages(filters)
  const result = calculateMetrics(rows, languages, filters.aggregation)
  const lines: CsvValue[][] = [
    ['Prompt / Lens — calculated study metrics'],
    ['Source', dataset.source],
    ['Sheet', dataset.sheet],
    ['Source SHA-256', dataset.sha256],
    ['Manual edits', edited],
    ['Platform filter', filters.platform],
    ['Difficulty filter', filters.difficulty],
    ['Languages', languages.map((language) => LANGUAGES[language]).join(', ')],
    ['Aggregation', filters.aggregation],
    ['Included tasks', result.n],
    ['Excluded tasks', result.excluded.map((task) => task.id).join(', ')],
    [
      'Model',
      'Pass rate (%)',
      'Full tasks',
      'At least one full language',
      'Partial cells',
      'Zero cells',
      'Full cells',
    ],
    ...result.models.map((model) => [
      model.name,
      model.rate,
      model.fullTasks,
      model.anyFullTasks,
      model.partial,
      model.zero,
      model.full,
    ]),
    ['Delta (pp)', result.delta],
    [],
    [
      'Task ID',
      'Task Name',
      'Platform',
      'Difficulty',
      'Rating',
      'Sol KZ',
      'Sol EN',
      'Sol Mix',
      'Sonnet KZ',
      'Sonnet EN',
      'Sonnet Mix',
      'Included',
      'Sol task mean (%)',
      'Sonnet task mean (%)',
      'Delta task means (pp)',
      'Mix gap (pp)',
    ],
    ...rows.map((task) => [
      task.id,
      task.name,
      task.platform,
      task.difficulty,
      task.rating,
      ...task.results.map((cell) => cell.value),
      isComplete(task),
      taskRate(task, 0, languages),
      taskRate(task, 1, languages),
      isComplete(task) ? taskRate(task, 1, languages)! - taskRate(task, 0, languages)! : null,
      mixGap(task),
    ]),
  ]
  const blob = new Blob(['\ufeff' + lines.map((row) => row.map(csvCell).join(';')).join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `llm-metrics-${filters.aggregation}-${filters.language}.csv`
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
