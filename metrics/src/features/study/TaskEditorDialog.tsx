import { MODEL_COLORS } from '../../app/theme'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseRounded from '@mui/icons-material/CloseRounded'
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded'
import { LANGUAGES, MODELS } from '../../domain/study/constants'
import { parseFraction } from '../../domain/study/metrics'
import type { Task } from '../../domain/study/types'
import { useStudy } from './useStudy'

export function TaskEditorDialog({ task, onClose }: { task: Task; onClose: () => void }) {
  const { dataset, saveTask } = useStudy()
  const [values, setValues] = useState(() => task.results.map((cell) => cell.value))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    const message = saveTask(task.id, values)
    setError(message)
    if (!message) onClose()
  }

  return (
    <Dialog open onClose={onClose} aria-labelledby="task-editor-title">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogTitle id="task-editor-title" sx={{ pr: 7, pb: 1 }}>
          <Typography
            component="span"
            variant="overline"
            color="text.secondary"
            sx={{ display: 'block' }}
          >
            {task.id} / Source row {task.row}
          </Typography>
          {task.name}
          <IconButton
            aria-label="Close task editor"
            onClick={onClose}
            sx={{ position: 'absolute', right: 14, top: 14 }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption" color="text.secondary">
            {task.platform} · {task.difficulty}
            {task.rating ? ` · ${task.rating}` : ''} · {dataset.sheet}
          </Typography>
          {MODELS.map((model, modelIndex) => (
            <Box key={model} sx={{ mt: 3 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: MODEL_COLORS[modelIndex],
                    borderRadius: '2px',
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {model}
                </Typography>
              </Stack>
              <Grid container spacing={1.5}>
                {LANGUAGES.map((language, languageIndex) => {
                  const index = modelIndex * 3 + languageIndex,
                    cell = task.results[index]
                  const parsed = parseFraction(values[index])
                  const invalid = submitted && !parsed.valid && !parsed.unknown
                  const source = cell.recovered
                    ? `Excel: ${cell.raw} → ${cell.value}`
                    : cell.edited
                      ? `Edited manually · original: ${cell.raw}`
                      : 'Source fraction'
                  return (
                    <Grid key={language} size={{ xs: 12, sm: 4 }}>
                      <TextField
                        fullWidth
                        label={`${language} · passed / total`}
                        value={values[index]}
                        autoComplete="off"
                        error={invalid}
                        helperText={invalid ? parsed.reason : `${cell.address} · ${source}`}
                        onChange={(event) =>
                          setValues((previous) =>
                            previous.map((value, i) => (i === index ? event.target.value : value)),
                          )
                        }
                        slotProps={{
                          htmlInput: { 'aria-label': `${model}, ${language}` },
                          formHelperText: { sx: { overflowWrap: 'anywhere', mx: 0.25 } },
                        }}
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </Box>
          ))}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Alert severity="info" sx={{ mt: 3 }} icon={false}>
            Enter a fraction such as 18/20. Use 5/? for an unknown denominator. Edits last until
            reload; export a CSV to keep the results.
          </Alert>
        </DialogContent>
        <DialogActions
          sx={{ px: 3, pb: 3, flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
        >
          {task.url ? (
            <Link
              href={task.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12 }}
            >
              Problem statement
              <OpenInNewRounded sx={{ fontSize: 13 }} />
            </Link>
          ) : (
            <Box />
          )}
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save and recalculate
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
