import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  eyebrow: string
  annotation?: string
  children: ReactNode
}

export function Panel({ title, eyebrow, annotation, children }: PanelProps) {
  return (
    <Card sx={{ height: '100%', minWidth: 0 }}>
      <CardContent sx={{ p: { xs: 2.25, md: 3 }, '&:last-child': { pb: { xs: 2.25, md: 3 } } }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2.5 }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              {eyebrow}
            </Typography>
            <Typography variant="h2" sx={{ mt: 0.6 }}>
              {title}
            </Typography>
          </Box>
          {annotation && (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
              {annotation}
            </Typography>
          )}
        </Stack>
        {children}
      </CardContent>
    </Card>
  )
}
