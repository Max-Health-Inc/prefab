import { isRecord, optionalRecord, optionalString } from '../core/guards.js'
import type { BridgeMessage, DisplayMode, HostContext, HostTheme } from './bridge.js'

const COLOR_SCHEMES: readonly NonNullable<HostTheme['colorScheme']>[] = ['light', 'dark', 'auto']
const DISPLAY_MODES: readonly DisplayMode[] = ['inline', 'fullscreen', 'pip']

export function isBridgeMessage(msg: unknown): msg is BridgeMessage {
  return isRecord(msg)
    && typeof msg.type === 'string'
    && (msg.id === undefined || typeof msg.id === 'string')
    && (msg.payload === undefined || isRecord(msg.payload))
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

/** A `prefab:init-response` payload as a host context, keeping only fields of the right type. */
export function prefabHostContext(payload: Record<string, unknown>): HostContext {
  const caps = optionalRecord(payload.capabilities) ?? {}
  const theme = optionalRecord(payload.theme)
  const toolInput = optionalRecord(payload.toolInput)
  const meta = optionalRecord(payload.meta)
  return {
    hostName: optionalString(payload.hostName),
    hostVersion: optionalString(payload.hostVersion),
    capabilities: {
      toast: optionalBoolean(caps.toast),
      clipboard: optionalBoolean(caps.clipboard),
      navigation: optionalBoolean(caps.navigation),
      messaging: optionalBoolean(caps.messaging),
      displayModes: availableDisplayModes(caps.displayModes),
    },
    ...(theme && { theme: prefabTheme(theme) }),
    ...(toolInput && { toolInput }),
    ...(meta && { meta }),
  }
}

/** A prefab-protocol theme, which already has the {@link HostTheme} shape. */
function prefabTheme(theme: Record<string, unknown>): HostTheme {
  const fontCss = optionalString(theme.fontCss)
  return {
    ...parseHostTheme({ theme: theme.colorScheme, styles: { variables: theme.variables } }),
    ...(fontCss != null && { fontCss }),
  }
}

export function availableDisplayModes(value: unknown): DisplayMode[] {
  const listed: unknown[] = Array.isArray(value) ? value : []
  return DISPLAY_MODES.filter(mode => listed.includes(mode))
}

/** The theme in an MCP Apps host context (`theme`, `styles.variables`, `styles.css.fonts`), keeping only applicable values. */
export function parseHostTheme(context: Record<string, unknown>): HostTheme {
  const theme: HostTheme = {}
  const scheme = COLOR_SCHEMES.find(s => s === context.theme)
  if (scheme) theme.colorScheme = scheme
  const styles = optionalRecord(context.styles)
  const variables = optionalRecord(styles?.variables)
  if (variables) {
    theme.variables = Object.fromEntries(
      Object.entries(variables).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    )
  }
  const fonts = optionalString(optionalRecord(styles?.css)?.fonts)
  if (fonts != null) theme.fontCss = fonts
  return theme
}
