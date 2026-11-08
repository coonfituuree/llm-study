import { MODEL_COLORS } from '../../app/theme'
import { Box, Stack, Typography } from '@mui/material'
import { MODELS } from '../../domain/study/constants'

export function ModelLegend() {
  return (
    <Stack direction="row" sx={{ gap: 2.5, mb: 1 }}>
      {MODELS.map((model, index) => (
        <Stack key={model} direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '2px', bgcolor: MODEL_COLORS[index] }} />
          <Typography variant="caption" color="text.secondary">
            {model}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
