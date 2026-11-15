import type { BadgeVariant } from '../components/data/index.js'

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  // Success
  available: 'success',
  active: 'success',
  enabled: 'success',
  approved: 'success',
  delivered: 'success',
  complete: 'success',
  completed: 'success',
  resolved: 'success',
  verified: 'success',
  published: 'success',
  open: 'success',
  healthy: 'success',
  connected: 'success',
  // Warning
  pending: 'warning',
  processing: 'warning',
  in_progress: 'warning',
  in_review: 'warning',
  placed: 'warning',
  waiting: 'warning',
  queued: 'warning',
  draft: 'warning',
  partial: 'warning',
  // Destructive / Error
  sold: 'destructive',
  inactive: 'destructive',
  disabled: 'destructive',
  deleted: 'destructive',
  cancelled: 'destructive',
  rejected: 'destructive',
  failed: 'destructive',
  error: 'destructive',
  expired: 'destructive',
  blocked: 'destructive',
  closed: 'destructive',
  revoked: 'destructive',
  suspended: 'destructive',
  disconnected: 'destructive',
}

/**
 * Get a Badge variant for a status string.
 * Falls back to 'outline' for unknown statuses.
 */
/** Whether `status` names a known status, so a value column can be shown as badges. */
export function isKnownStatus(status: string): boolean {
  return status.toLowerCase().replace(/[\s-]/g, '_') in STATUS_VARIANTS
}

export function statusVariant(status: string): BadgeVariant {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_')
  return STATUS_VARIANTS[normalized] ?? 'outline'
}

/**
 * Register additional status→variant mappings.
 */
export function registerStatusVariants(mappings: Record<string, BadgeVariant>): void {
  for (const [key, variant] of Object.entries(mappings)) {
    STATUS_VARIANTS[key.toLowerCase().replace(/[\s-]/g, '_')] = variant
  }
}

const VARIANT_COLOR: Record<BadgeVariant, string> = {
  default: 'var(--primary)',
  secondary: 'var(--muted-foreground)',
  outline: 'var(--muted-foreground)',
  destructive: 'var(--destructive)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  info: 'var(--info)',
}

/** The theme color behind a Badge variant. */
export function variantColor(variant: BadgeVariant): string {
  return VARIANT_COLOR[variant]
}

/** The theme color for a status, so dots and badges for the same status agree. */
export function statusColor(status: string): string {
  return VARIANT_COLOR[statusVariant(status)]
}
