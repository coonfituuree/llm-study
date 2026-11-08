import { DEFAULT_FILTERS } from '../../domain/study/constants'
import type { StudyDataset, StudyFilters } from '../../domain/study/types'
import { initialDataset as original } from '../../data/initialDataset'

export interface StudyState {
  dataset: StudyDataset
  filters: StudyFilters
  edited: boolean
}
type StudyAction =
  | { type: 'filters'; patch: Partial<StudyFilters> }
  | { type: 'resetFilters' }
  | { type: 'import'; dataset: StudyDataset }
  | { type: 'edit'; id: string; values: string[] }
  | { type: 'resetDataset' }

export function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'filters':
      return { ...state, filters: { ...state.filters, ...action.patch } }
    case 'resetFilters':
      return { ...state, filters: { ...DEFAULT_FILTERS } }
    case 'import':
      return { dataset: action.dataset, filters: { ...DEFAULT_FILTERS }, edited: false }
    case 'resetDataset':
      return { dataset: original, filters: { ...DEFAULT_FILTERS }, edited: false }
    case 'edit': {
      let hasChanges = false
      const tasks = state.dataset.tasks.map((task) =>
        task.id !== action.id
          ? task
          : {
              ...task,
              results: task.results.map((cell, i) => {
                const value = action.values[i].replace(/\s/g, '')
                if (cell.value === value) return cell
                hasChanges = true
                return { ...cell, value, recovered: false, edited: true }
              }),
            },
      )
      return hasChanges ? { ...state, dataset: { ...state.dataset, tasks }, edited: true } : state
    }
  }
}
