import { lazy, Suspense, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Skeleton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import UploadFileOutlined from '@mui/icons-material/UploadFileOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import { StudyLayout } from '../components/layout/StudyLayout'
import { StudyFilters } from '../features/study/StudyFilters'
import { TaskEditorDialog } from '../features/study/TaskEditorDialog'
import { useStudy } from '../features/study/useStudy'
import { useHashView } from '../hooks/useHashView'
import type { Task } from '../domain/study/types'

const OverviewPage = lazy(() => import('../pages/OverviewPage'))
const DataPage = lazy(() => import('../pages/DataPage'))
const MethodologyPage = lazy(() => import('../pages/MethodologyPage'))

const pageContent = {
  overview: {
    title: 'Explore the difference.',
    subtitle: 'Two models, three languages, one set of algorithmic tasks.',
  },
  data: {
    title: 'Explore the data.',
    subtitle: 'Every test result, its source and its inclusion status.',
  },
  method: {
    title: 'Every number has a method.',
    subtitle: 'Formulas, inclusion rules and comparison with the original report.',
  },
}

export default function App() {
  const view = useHashView()
  const study = useStudy()
  const { dataset, metrics, tasks, filters, notification } = study
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const selectedTask = dataset.tasks.find((task) => task.id === selectedTaskId)
  const selectTask = (task: Task) => setSelectedTaskId(task.id)

  return (
    <StudyLayout view={view}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'start', lg: 'center' },
          gap: 2.5,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Prompt language × Code quality
          </Typography>
          <Typography variant="h1" sx={{ mt: 1, mb: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
            {pageContent[view].title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {pageContent[view].subtitle}
          </Typography>
        </Box>
        <h1>sk-proj-</h1>
        <h1>ihlrZLd6readgYPuhhAN44jrRgerWPfHKUzpO4FPMJ1Z4iQnqIehqvxhTllS1k5TSVfoHABGIlT3BlbkFJvxd6O_x0fLkh8_OzvBFP8kcVE87y4ohoueOIF4kQ0U-OMXNAdUpqaoptGIPZjkNFRznF6rdpQA</h1>
        <Stack
          direction="row"
          className="heading-actions"
          sx={{ gap: 1, flexShrink: 0, flexWrap: 'wrap' }}
        >
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadFileOutlined />}
            loading={study.importing}
          >
            Import Excel
            <input
              type="file"
              accept=".xlsx"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void study.importFile(file)
                event.target.value = ''
              }}
            />
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadOutlined />}
            onClick={() => study.exportCsv()}
          >
            Export selection
          </Button>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          py: 1.25,
          px: 1.75,
        }}
      >
        <DescriptionOutlined sx={{ fontSize: 17, color: 'primary.main' }} />
        <Tooltip title={dataset.sha256 ? `Source file SHA-256: ${dataset.sha256}` : dataset.source}>
          <Typography variant="caption" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
            {dataset.source}
          </Typography>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
        <Typography variant="caption" color="text.secondary">
          {dataset.sheet} · {dataset.tasks.length} tasks
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Chip
          label={study.edited ? 'Data edited' : study.canRestore ? 'Imported file' : 'Source data'}
          color="primary"
          variant="outlined"
        />
        {study.canRestore && (
          <Button
            size="small"
            onClick={study.resetDataset}
            sx={{ py: 0.25, fontSize: 11 }}
            className="restore-button"
          >
            Restore original
          </Button>
        )}
      </Stack>

      <StudyFilters />
      <Divider />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          gap: 1,
          justifyContent: 'space-between',
          alignItems: { sm: 'center' },
          py: 1.75,
          mb: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary" aria-live="polite">
          <Box component="strong" sx={{ color: 'text.primary' }}>
            {metrics.n} of {tasks.length} tasks
          </Box>{' '}
          included · {metrics.excluded.length} excluded
          {metrics.excluded.length > 0 &&
            ` (${metrics.excluded.map((task) => task.id).join(', ')})`}{' '}
          · {filters.aggregation === 'macro' ? 'equal task weights' : 'weighted by test count'}
        </Typography>
        <Link
          href="#method"
          underline="hover"
          sx={{
            display: 'inline-flex',
            gap: 0.75,
            alignItems: 'center',
            color: 'text.secondary',
            fontSize: 11,
            flexShrink: 0,
          }}
        >
          How metrics are calculated
          <ArrowOutwardRounded sx={{ fontSize: 12 }} />
        </Link>
      </Stack>

      <Suspense
        fallback={
          <Stack sx={{ gap: 2 }}>
            <Skeleton variant="rounded" height={160} />
            <Skeleton variant="rounded" height={350} />
          </Stack>
        }
      >
        {view === 'overview' && <OverviewPage onSelectTask={selectTask} />}
        {view === 'data' && <DataPage onSelectTask={selectTask} />}
        {view === 'method' && <MethodologyPage />}
      </Suspense>

      {selectedTask && (
        <TaskEditorDialog
          key={selectedTask.id}
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={notification?.severity === 'error' ? 12000 : 4500}
        onClose={(_, reason) => {
          if (reason !== 'clickaway') study.dismissNotification()
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notification?.severity ?? 'success'}
          onClose={study.dismissNotification}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </StudyLayout>
  )
}
