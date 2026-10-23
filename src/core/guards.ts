export function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

export function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

export function optionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

export function optionalRecord(value: unknown): Record<string, unknown> | undefined {
  return isRecord(value) ? value : undefined
}

export function recordList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

export function recordOrList(value: unknown): Record<string, unknown>[] {
  return isRecord(value) ? [value] : recordList(value)
}

export function scalarStringRecord(value: unknown): Record<string, string> {
  const out: Record<string, string> = {}
  if (!isRecord(value)) return out
  for (const [key, v] of Object.entries(value)) {
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[key] = String(v)
  }
  return out
}
