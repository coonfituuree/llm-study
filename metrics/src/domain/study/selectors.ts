import { ALL_LANGUAGES, DIFFICULTIES, EPSILON, LANGUAGES, MODELS } from './constants'
import { calculateMetrics, mixGap, taskRate } from './metrics'
import type {
  Aggregation,
  ComparisonRow,
  LanguageIndex,
  ReportCheck,
  StudyMetrics,
  Task,
} from './types'

export function getLanguageMetrics(tasks: Task[], aggregation: Aggregation) {
  return ALL_LANGUAGES.map((language) => calculateMetrics(tasks, [language], aggregation))
}

export function getDifficultyMetrics(
  tasks: Task[],
  languages: LanguageIndex[],
  aggregation: Aggregation,
) {
  return DIFFICULTIES.map((name) => ({
    name,
    ...calculateMetrics(
      tasks.filter((t) => t.difficulty === name),
      languages,
      aggregation,
    ),
  }))
}

export function getPlatformMetrics(
  tasks: Task[],
  languages: LanguageIndex[],
  aggregation: Aggregation,
) {
  const groups = [
    { name: 'LeetCode', matches: (t: Task) => t.platform === 'LeetCode', sub: false },
    { name: 'Codeforces', matches: (t: Task) => t.platform === 'Codeforces', sub: false },
    {
      name: 'CF · 800',
      matches: (t: Task) => t.platform === 'Codeforces' && t.rating === 800,
      sub: true,
    },
    {
      name: 'CF · 1100–1500',
      matches: (t: Task) =>
        t.platform === 'Codeforces' && t.rating !== null && t.rating >= 1100 && t.rating <= 1500,
      sub: true,
    },
    {
      name: 'CF · 1900+',
      matches: (t: Task) => t.platform === 'Codeforces' && t.rating !== null && t.rating >= 1900,
      sub: true,
    },
  ]
  return groups.map(({ name, matches, sub }) => ({
    name,
    sub,
    ...calculateMetrics(tasks.filter(matches), languages, aggregation),
  }))
}

export function getTaskRankings(tasks: Task[], languages: LanguageIndex[]) {
  return tasks
    .map((task) => {
      const sol = taskRate(task, 0, languages)!,
        sonnet = taskRate(task, 1, languages)!
      return { task, sol, sonnet, delta: sonnet - sol }
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.task.id.localeCompare(b.task.id))
    .slice(0, 5)
}

export function getMixRankings(tasks: Task[]) {
  return tasks
    .map((task) => ({ task, delta: mixGap(task)! }))
    .filter((row) => row.delta < -EPSILON)
    .sort((a, b) => a.delta - b.delta || a.task.id.localeCompare(b.task.id))
    .slice(0, 5)
}

export function getSummaryRows(
  result: StudyMetrics,
  languageMetrics: StudyMetrics[],
): ComparisonRow[] {
  return [
    { label: 'Mean pass rate', values: result.models.map((m) => m.rate), kind: 'percent' },
    ...LANGUAGES.map((language, i) => ({
      label: `Pass rate · ${language} (all-language context)`,
      values: languageMetrics[i].models.map((m) => m.rate),
      kind: 'percent' as const,
    })),
    {
      label: '100% in every selected language, tasks',
      values: result.models.map((m) => m.fullTasks),
      kind: 'count',
    },
    {
      label: '100% in at least one selected language, tasks',
      values: result.models.map((m) => m.anyFullTasks),
      kind: 'count',
    },
    ...LANGUAGES.map((language, i) => ({
      label: `Tasks at 100% · ${language} (all-language context)`,
      values: languageMetrics[i].models.map((m) => m.fullTasks),
      kind: 'count' as const,
    })),
    {
      label: 'Partial results, % of cells',
      values: result.models.map((m) => m.partialRate),
      kind: 'percent',
    },
    { label: 'Partial results, cells', values: result.models.map((m) => m.partial), kind: 'count' },
    { label: 'Results at 0%, cells', values: result.models.map((m) => m.zero), kind: 'count' },
    { label: 'Results at 100%, cells', values: result.models.map((m) => m.full), kind: 'count' },
  ]
}

export function getReportChecks(tasks: Task[]): ReportCheck[] {
  const all = calculateMetrics(tasks)
  const languageMetrics = getLanguageMetrics(tasks, 'macro')
  const rows: Omit<ReportCheck, 'matches'>[] = [
    { label: 'Included tasks', expected: 78, actual: all.n, kind: 'count' },
    {
      label: 'Mean pass rate · 5.6-Sol',
      expected: 83.7,
      actual: all.models[0].rate,
      kind: 'percent',
    },
    {
      label: 'Mean pass rate · Sonnet-5.5',
      expected: 95.2,
      actual: all.models[1].rate,
      kind: 'percent',
    },
    { label: 'Δ Sonnet − Sol, pp', expected: 11.5, actual: all.delta, kind: 'decimal' },
    ...([0, 1] as const).flatMap((model) =>
      LANGUAGES.map((language, i) => ({
        label: `${MODELS[model]} · ${language}`,
        expected: [
          [83, 87.7, 80.4],
          [95.6, 98.3, 91.7],
        ][model][i],
        actual: languageMetrics[i].models[model].rate,
        kind: 'percent' as const,
      })),
    ),
    ...([0, 1] as const).map((model) => ({
      label: `100% in all languages · ${MODELS[model]}`,
      expected: [53, 57][model],
      actual: all.models[model].fullTasks,
      kind: 'count' as const,
    })),
    ...([0, 1] as const).map((model) => ({
      label: `Partial cells · ${MODELS[model]}`,
      expected: [61, 38][model],
      actual: all.models[model].partial,
      kind: 'count' as const,
    })),
    {
      label: 'Sonnet better / tied / worse',
      expected: '23 / 53 / 2',
      actual: `${all.wins.sonnet} / ${all.wins.equal} / ${all.wins.sol}`,
      kind: 'text',
    },
  ]
  return rows.map((row) => ({
    ...row,
    matches:
      row.actual !== null &&
      (row.kind === 'percent' || row.kind === 'decimal'
        ? Math.round(Number(row.actual) * 10) === Math.round(Number(row.expected) * 10)
        : row.actual === row.expected),
  }))
}
