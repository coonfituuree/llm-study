import { createContext } from 'react'
import type { LanguageIndex, StudyMetrics, StudyFilters, Task } from '../../domain/study/types'
import type { StudyState } from './study-reducer'

interface StudyContextValue extends StudyState {
  tasks: Task[]
  languages: LanguageIndex[]
  metrics: StudyMetrics
  importing: boolean
  notification: { message: string; severity: 'success' | 'error' } | null
  canRestore: boolean
  setFilters: (patch: Partial<StudyFilters>) => void
  resetFilters: () => void
  resetDataset: () => void
  dismissNotification: () => void
  importFile: (file: File) => Promise<void>
  saveTask: (id: string, values: string[]) => string | null
  exportCsv: (rows?: Task[]) => void
}

export const StudyContext = createContext<StudyContextValue | null>(null)
