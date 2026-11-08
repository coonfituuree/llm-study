import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

interface MetricCardProps {
  label: string
  value: string
  unit?: string
  description: string
  featured?: boolean
  color?: string
}

export function MetricCard({
  label,
  value,
  unit,
  description,
  featured = false,
  color,
}: MetricCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: featured ? 'primary.main' : 'background.paper',
        color: featured ? 'primary.contrastText' : 'text.primary',
        borderColor: featured ? 'primary.main' : 'divider',
      }}
    >
      <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          {color && (
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '2px',
                bgcolor: featured ? 'primary.contrastText' : color,
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{ color: featured ? 'primary.contrastText' : 'text.secondary' }}
          >
            {label}
          </Typography>
        </Stack>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: '2rem', lg: '2.65rem' },
            lineHeight: 1.35,
            letterSpacing: '-1.7px',
            fontWeight: 500,
            my: 1.6,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
          {unit && (
            <Box component="span" sx={{ fontSize: '1.1rem', letterSpacing: '-0.5px', ml: 0.5 }}>
              {unit}
            </Box>
          )}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: featured ? 'primary.contrastText' : 'text.secondary',
            display: 'block',
            fontSize: '0.65rem',
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}
