import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import './index.css'
import App from './app/App'
import { theme } from './app/theme'
import { StudyProvider } from './features/study/StudyProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StudyProvider>
        <App />
      </StudyProvider>
    </ThemeProvider>
  </StrictMode>,
)
