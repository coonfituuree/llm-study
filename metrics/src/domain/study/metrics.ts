import { ALL_LANGUAGES, EPSILON, MODELS } from './constants'
import type {
  Aggregation,
  LanguageIndex,
  ModelIndex,
  ParsedFraction,
  StudyFilters,
  StudyMetrics,
  Task,
} from './types'

export function parseFraction(value: string): ParsedFraction {
  const text = value.trim()
  const match = /^(\d+)\s*\/\s*(\d+|\?)$/.exec(text)
  if (!match) return { valid: false, reason: text ? 'Invalid fraction format' : 'Empty cell' }
  const passed = Number(match[1])
  if (!Number.isSafeInteger(passed))
    return { valid: false, reason: 'Number exceeds the safe integer range' }
  if (match[2] === '?')
    return { valid: false, unknown: true, passed, reason: 'Unknown denominator' }
  const total = Number(match[2])
  if (!Number.isSafeInteger(total) || total <= 0 || passed > total) {
    return { valid: false, reason: 'Expected 0 ≤ passed ≤ total and total > 0' }
  }
  return { valid: true, passed, total, rate: passed / total }
}

export function isComplete(task: Task): boolean {
  return task.results.length === 6 && task.results.every((cell) => parseFraction(cell.value).valid)
}

export function mean(values: number[]): number | null {
  return values.length ? values.reduce((sum, n) => sum + n, 0) / values.length : null
}

export function taskRate(
  task: Task,
  model: ModelIndex,
  languages: LanguageIndex[] = ALL_LANGUAGES,
): number | null {
  const rates: number[] = []
  for (const language of languages) {
    const cell = task.results[model * 3 + language]
    const parsed = parseFraction(cell?.value ?? '')
    if (!parsed.valid) return null
    rates.push(parsed.rate)
  }
  const average = mean(rates)
  return average === null ? null : average * 100
}

export function calculateMetrics(
  tasks: Task[],
  languages: LanguageIndex[] = ALL_LANGUAGES,
  aggregation: Aggregation = 'macro',
): StudyMetrics {
  // All six results are required to preserve the same paired cohort for every view.
  const included = tasks.filter(isComplete)
  const excluded = tasks.filter((task) => !isComplete(task))
  const models = MODELS.map((name, model) => {
    const rows = included.map((task) =>
      languages.map((language) => {
        const parsed = parseFraction(task.results[model * 3 + language].value)
        if (!parsed.valid) throw new Error('A complete task contains an invalid result.')
        return parsed
      }),
    )
    const cells = rows.flat()
    const passed = cells.reduce((sum, cell) => sum + cell.passed, 0)
    const total = cells.reduce((sum, cell) => sum + cell.total, 0)
    const rate = !cells.length
      ? null
      : aggregation === 'micro'
        ? (passed / total) * 100
        : mean(cells.map((cell) => cell.rate))! * 100
    const full = cells.filter((cell) => cell.passed === cell.total).length
    const zero = cells.filter((cell) => cell.passed === 0).length
    const partial = cells.length - full - zero
    return {
      name,
      rate,
      passed,
      total,
      cells: cells.length,
      full,
      zero,
      partial,
      partialRate: cells.length ? (partial / cells.length) * 100 : null,
      fullTasks: rows.filter(
        (row) => row.length > 0 && row.every((cell) => cell.passed === cell.total),
      ).length,
      anyFullTasks: rows.filter((row) => row.some((cell) => cell.passed === cell.total)).length,
    }
  })
  const wins = { sonnet: 0, equal: 0, sol: 0 }
  for (const task of included) {
    const delta = taskRate(task, 1, languages)! - taskRate(task, 0, languages)!
    wins[Math.abs(delta) < EPSILON ? 'equal' : delta > 0 ? 'sonnet' : 'sol']++
  }
  return {
    included,
    excluded,
    n: included.length,
    models,
    wins,
    delta:
      models[0].rate === null || models[1].rate === null ? null : models[1].rate - models[0].rate,
  }
}

export function mixGap(task: Task): number | null {
  if (!isComplete(task)) return null
  return mean(
    ([0, 1] as const).map((model) => taskRate(task, model, [2])! - taskRate(task, model, [0, 1])!),
  )
}

export function filterTasks(tasks: Task[], filters: StudyFilters): Task[] {
  return tasks.filter(
    (task) =>
      (filters.platform === 'all' || task.platform === filters.platform) &&
      (filters.difficulty === 'all' || task.difficulty === filters.difficulty),
  )
}

export function getLanguages(filters: StudyFilters): LanguageIndex[] {
  return filters.language === 'all' ? ALL_LANGUAGES : [filters.language]
}
