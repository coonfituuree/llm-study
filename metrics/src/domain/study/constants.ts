import type { LanguageIndex, StudyFilters } from './types'

export const LANGUAGES = ['KZ', 'EN', 'Mix'] as const
export const LANGUAGE_NAMES = ['Kazakh', 'English', 'Kazakh + Russian'] as const
export const ALL_LANGUAGES: LanguageIndex[] = [0, 1, 2]
export const MODELS = ['5.6-Sol', 'Sonnet-5.5'] as const
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
export const EPSILON = 1e-9
export const DEFAULT_FILTERS: StudyFilters = {
  language: 'all',
  platform: 'all',
  difficulty: 'all',
  aggregation: 'macro',
}
