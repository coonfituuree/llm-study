import { useContext } from 'react'
import { StudyContext } from './study-context'

export function useStudy() {
  const value = useContext(StudyContext)
  if (!value) throw new Error('useStudy must be used inside StudyProvider.')
  return value
}
