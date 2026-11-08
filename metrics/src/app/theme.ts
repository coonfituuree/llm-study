import { createTheme } from '@mui/material/styles'

// Keep the standard Material UI palette, including semantic status colors.
export const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f5f5f5' },
  },
  typography: {
    h1: { fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-1px', lineHeight: 1.2 },
    h2: { fontSize: '1.2rem', fontWeight: 500 },
    h3: { fontSize: '1.05rem', fontWeight: 500 },
    body2: { lineHeight: 1.75 },
    caption: { lineHeight: 1.7 },
    overline: { fontSize: '0.65rem', letterSpacing: '1.5px', fontWeight: 500 },
  },
  components: {
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiTextField: { defaultProps: { size: 'small', variant: 'outlined' } },
    MuiChip: { defaultProps: { size: 'small' } },
    MuiTableCell: {
      styleOverrides: {
        root: { fontVariantNumeric: 'tabular-nums' },
        head: ({ theme }) => ({ fontWeight: 500, backgroundColor: theme.palette.grey[50] }),
      },
    },
    MuiTooltip: { defaultProps: { arrow: true } },
    MuiDialog: { defaultProps: { fullWidth: true, maxWidth: 'sm' } },
  },
})

export const MODEL_COLORS = [theme.palette.primary.main, theme.palette.secondary.main] as const
export const OUTCOME_COLORS = [
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main,
] as const
