export function formatValue(value, format) {
  if (format === 'currency') return '$' + Math.round(value).toLocaleString('en-US')
  if (format === 'number') return Math.round(value).toLocaleString('en-US')
  if (format === 'x') return value.toFixed(2) + 'x'
  if (format === 'pct') return (value * 100).toFixed(1) + '%'
  return String(value)
}

export function formatPct(fraction) {
  const sign = fraction > 0 ? '+' : ''
  return sign + (fraction * 100).toFixed(1) + '%'
}
