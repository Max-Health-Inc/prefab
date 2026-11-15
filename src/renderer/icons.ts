import { a2uiIconName } from '../a2ui/icons.js'
import { log } from '../core/logger.js'
import { ICON_GLYPHS } from './icons.generated.js'

const SVG_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'

/** Inline SVG for a Material or Lucide icon name, or undefined when prefab has no glyph for it. */
export function iconSvg(name: string): string | undefined {
  const key = a2uiIconName(name)
  if (key == null || !(key in ICON_GLYPHS)) return undefined
  return `${SVG_OPEN}${ICON_GLYPHS[key]}</svg>`
}

/** Draw `name` into `host`, keeping the requested name on `data-icon`. */
export function fillIcon(host: HTMLElement, name: string): void {
  host.setAttribute('data-icon', name)
  const svg = iconSvg(name)
  if (svg === undefined) {
    if (name !== '') log.warn(`icon "${name}" has no glyph`)
    return
  }
  host.innerHTML = svg
}
