export type LanguageIndex = 0 | 1 | 2
export type ModelIndex = 0 | 1
export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Platform = 'LeetCode' | 'Codeforces'
export type Aggregation = 'macro' | 'micro'
export type View = 'overview' | 'data' | 'method'

export interface ResultCell {
  value: string
  raw: string
  recovered: boolean
  address: string
  edited?: boolean
}

export interface Task {
  id: string
  name: string
  difficulty: Difficulty
  platform: Platform
  rating: number | null
  url: string
  row: number
  results: ResultCell[]
}

export interface StudyDataset {
  source: string
  sheet: string
  sha256: string
  recoveredCells: number
  tasks: Task[]
}

export type ParsedFraction =
  | { valid: true; passed: number; total: number; rate: number }
  | { valid: false; reason: string; unknown?: boolean; passed?: number }

export interface StudyFilters {
  language: 'all' | LanguageIndex
  platform: 'all' | Platform
  difficulty: 'all' | Difficulty
  aggregation: Aggregation
}

export interface ModelMetrics {
  name: string
  rate: number | null
  passed: number
  total: number
  cells: number
  full: number
  zero: number
  partial: number
  partialRate: number | null
  fullTasks: number
  anyFullTasks: number
}

export interface StudyMetrics {
  included: Task[]
  excluded: Task[]
  n: number
  models: ModelMetrics[]
  wins: { sonnet: number; equal: number; sol: number }
  delta: number | null
}

export interface ComparisonRow {
  label: string
  values: (number | null)[]
  kind: 'percent' | 'count'
}

export interface ReportCheck {
  label: string
  expected: number | string
  actual: number | string | null
  kind: 'percent' | 'decimal' | 'count' | 'text'
  matches: boolean
}
