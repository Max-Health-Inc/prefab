/**
 * TDD R10 — inline Svg without an xmlns must still render.
 *
 * Authors routinely write `<svg viewBox=...>` with no xmlns (it's optional in
 * HTML). renderSvg parses with DOMParser image/svg+xml (strict XML), where a
 * missing xmlns yields namespace-less elements that render at 0x0. The renderer
 * should inject the SVG namespace so the markup renders.
 *
 * @happy-dom
 */

import { describe, it, expect, beforeEach } from 'bun:test'
import { Store } from '../src/renderer/state'
import { renderNode } from '../src/renderer/engine'
import type { ComponentNode, RenderContext } from '../src/renderer/engine'
import { registerAllComponents } from '../src/renderer/components/index'
import { createNoopTransport } from '../src/renderer/transport'

beforeEach(() => { registerAllComponents() })

function makeCtx(): RenderContext {
  return { store: new Store({}), scope: {}, transport: createNoopTransport(), rerender: () => {} } as RenderContext
}

const SVG_NS = 'http://www.w3.org/2000/svg'

describe('inline Svg', () => {
  it('renders an svg authored without xmlns in the SVG namespace', () => {
    const node: ComponentNode = {
      type: 'Svg',
      content: "<svg viewBox='0 0 100 100' width='96' height='96'><circle cx='50' cy='50' r='44' fill='#6366f1'/></svg>",
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    const svg = dom.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg!.namespaceURI).toBe(SVG_NS)
    const circle = dom.querySelector('circle')
    expect(circle).not.toBeNull()
    expect(circle!.namespaceURI).toBe(SVG_NS)
  })

  it('leaves an svg that already declares xmlns alone', () => {
    const node: ComponentNode = {
      type: 'Svg',
      content: `<svg xmlns='${SVG_NS}' width='40' height='40'><rect width='40' height='40'/></svg>`,
    }
    const dom = renderNode(node, makeCtx()) as HTMLElement
    const svg = dom.querySelector('svg')
    expect(svg!.namespaceURI).toBe(SVG_NS)
    expect(dom.querySelector('rect')).not.toBeNull()
  })
})
