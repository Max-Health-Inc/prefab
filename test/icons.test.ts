import { describe, it, expect } from 'bun:test'
import { A2UI_ICONS } from '../src/a2ui/icons'
import { ICON_GLYPHS } from '../src/renderer/icons.generated'
import { iconSvg } from '../src/renderer/icons'
import { registerAllComponents } from '../src/renderer/components/index'
import { makeRenderCtx, renderEl, query } from './helpers/render'

registerAllComponents()

describe('icon glyphs', () => {
  it('cover every A2UI icon, so a name the emitter accepts always draws', () => {
    expect(A2UI_ICONS.filter(name => !(name in ICON_GLYPHS))).toEqual([])
  })

  it('resolve Lucide spellings through the A2UI aliases', () => {
    expect(iconSvg('CheckCircle')).toBe(iconSvg('check'))
    expect(iconSvg('alert-triangle')).toBe(iconSvg('warning'))
    expect(iconSvg('no-such-icon')).toBeUndefined()
  })
})

describe('Icon and Alert draw their glyph', () => {
  it('Icon renders an inline svg and keeps the requested name', () => {
    const dom = renderEl({ type: 'Icon', name: 'Settings' }, makeRenderCtx())
    expect(dom.getAttribute('data-icon')).toBe('Settings')
    expect(query(dom, 'svg', SVGSVGElement).getAttribute('aria-hidden')).toBe('true')
  })

  it('Alert icon renders an inline svg', () => {
    const dom = renderEl({ type: 'Alert', icon: 'AlertTriangle', variant: 'warning', children: [] }, makeRenderCtx())
    expect(query(dom, '.pf-alert-icon svg', SVGSVGElement)).toBeTruthy()
  })

  it('an unknown name renders an empty icon', () => {
    const dom = renderEl({ type: 'Icon', name: 'no-such-icon' }, makeRenderCtx())
    expect(dom.querySelector('svg')).toBeNull()
  })
})
