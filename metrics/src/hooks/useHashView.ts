import { useEffect, useState } from 'react'
import type { View } from '../domain/study/types'

function readView(): View {
  const hash = window.location.hash.slice(1)
  return hash === 'data' || hash === 'method' ? hash : 'overview'
}

export function useHashView() {
  const [view, setView] = useState<View>(readView)
  useEffect(() => {
    const handleHashChange = () => setView(readView())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  return view
}
