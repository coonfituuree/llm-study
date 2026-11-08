import { useMemo, useReducer, useState } from 'react'
import type { ReactNode } from 'react'
import { initialDataset as original } from '../../data/initialDataset'
import { studyReducer } from './study-reducer'
import { StudyContext } from './study-context'
import { DEFAULT_FILTERS } from '../../domain/study/constants'
import {
  calculateMetrics,
  filterTasks,
  getLanguages,
  parseFraction,
} from '../../domain/study/metrics'
import type { StudyFilters } from '../../domain/study/types'
import { exportStudyCsv } from '../../services/csv'
import { readWorkbook } from '../../services/workbook'

function useStudyState() {
  const [state, dispatch] = useReducer(studyReducer, {
    dataset: original,
    filters: { ...DEFAULT_FILTERS },
    edited: false,
  })
  const [importing, setImporting] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    severity: 'success' | 'error'
  } | null>(null)
  const tasks = useMemo(
    () => filterTasks(state.dataset.tasks, state.filters),
    [state.dataset.tasks, state.filters],
  )
  const languages = useMemo(() => getLanguages(state.filters), [state.filters])
  const metrics = useMemo(
    () => calculateMetrics(tasks, languages, state.filters.aggregation),
    [tasks, languages, state.filters.aggregation],
  )

  const notify = (message: string, severity: 'success' | 'error' = 'success') =>
    setNotification({ message, severity })
  async function importFile(file: File) {
    setImporting(true)
    try {
      const dataset = await readWorkbook(file)
      dispatch({ type: 'import', dataset })
      notify(
        `Imported ${dataset.tasks.length} tasks. Restored ${dataset.recoveredCells} date-formatted fractions.`,
      )
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Unable to import this workbook.', 'error')
    } finally {
      setImporting(false)
    }
  }
  function saveTask(id: string, values: string[]): string | null {
    if (values.length !== 6) return 'A task must have six results.'
    for (const value of values) {
      const parsed = parseFraction(value)
      if (!parsed.valid && !parsed.unknown) return parsed.reason
    }
    dispatch({ type: 'edit', id, values })
    notify('Results saved. All metrics recalculated.')
    return null
  }
  function exportCsv(rows = tasks) {
    exportStudyCsv(state.dataset, rows, state.filters, state.edited)
    notify(`Exported metrics and ${rows.length} tasks.`)
  }

  return {
    ...state,
    tasks,
    languages,
    metrics,
    importing,
    notification,
    canRestore: state.edited || state.dataset !== original,
    setFilters: (patch: Partial<StudyFilters>) => dispatch({ type: 'filters', patch }),
    resetFilters: () => dispatch({ type: 'resetFilters' }),
    resetDataset: () => {
      dispatch({ type: 'resetDataset' })
      notify('Original dataset restored.')
    },
    dismissNotification: () => setNotification(null),
    importFile,
    saveTask,
    exportCsv,
  }
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const value = useStudyState()
  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
}
