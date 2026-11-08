const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatNumber(value: number | null): string {
  return value === null || !Number.isFinite(value)
    ? '—'
    : formatter.format(Math.abs(value) < 1e-7 ? 0 : value)
}
export function percent(value: number | null): string {
  return value === null ? '—' : `${formatNumber(value)}%`
}
export function signed(value: number | null): string {
  return value === null ? '—' : `${value > 1e-7 ? '+' : ''}${formatNumber(value)}`
}
export function deltaColor(value: number | null): string {
  return value === null ? 'text.secondary' : value < -1e-9 ? 'error.main' : 'primary.main'
}
