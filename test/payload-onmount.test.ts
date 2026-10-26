import { describe, it, expect } from 'bun:test'
import { PrefabRenderer, type PrefabWireData } from '../src/renderer/index'
import type { McpTransport } from '../src/renderer/actions'

const tick = () => new Promise(r => setTimeout(r, 0))

function payload(label: string): PrefabWireData {
  return {
    $prefab: { version: '0.3' },
    view: { type: 'Button', label, onClick: { action: 'toolCall', tool: 'next' } },
    onMount: { action: 'appendState', key: 'mounts', value: label },
  }
}

describe('payload onMount', () => {
  it('runs once when the payload mounts, not on a re-render', async () => {
    const mounted = PrefabRenderer.mount(document.createElement('div'), payload('first'))
    await tick()
    mounted.rerender()
    await tick()
    expect(mounted.store.get('mounts')).toEqual(['first'])
    mounted.destroy()
  })

  it('runs once for each payload a tool result remounts', async () => {
    const transport: McpTransport = {
      callTool: () => Promise.resolve({ structuredContent: payload('second') }),
      sendMessage: () => Promise.resolve(),
    }
    const root = document.createElement('div')
    const mounted = PrefabRenderer.mount(root, payload('first'), { transport })
    await tick()
    root.querySelector('button')?.click()
    await tick()
    await tick()
    mounted.rerender()
    await tick()
    expect(mounted.store.get('mounts')).toEqual(['first', 'second'])
    mounted.destroy()
  })
})
