/**
 * Serving A2UI over MCP.
 *
 * What matters here is the envelope rather than the components: a host routes a
 * payload to its A2UI renderer by MIME type, so the type and the wrapper shape
 * are the contract.
 */

import { describe, expect, test } from 'bun:test'
import { Column, H1 } from '../src/index.js'
import { display_a2ui, registerA2uiResource, A2UI_RESOURCE_URI } from '../src/mcp/a2ui.js'
import { A2UI_MIME } from '../src/a2ui/types.js'
import type { ResourceConfig, ResourceReadHandler } from '../src/mcp/resource.js'
import { conformanceErrors } from './helpers/a2ui-validator.js'

const view = () => Column({ children: [H1('Settings')] })

/** Minimal stand-in for the structural `McpServerLike` interface. */
function fakeServer() {
  const calls: { name: string; uri: string; config: ResourceConfig; handler: ResourceReadHandler }[] = []
  return {
    calls,
    registerResource(name: string, uri: string, config: ResourceConfig, handler: ResourceReadHandler) {
      calls.push({ name, uri, config, handler })
    },
  }
}

describe('display_a2ui', () => {
  test('embeds the payload as a resource a host can route by MIME type', () => {
    const result = display_a2ui(view())
    const [content] = result.content
    expect(content).toMatchObject({ type: 'resource', resource: { uri: A2UI_RESOURCE_URI, mimeType: A2UI_MIME } })
  })

  test('carries the same payload structurally', () => {
    const result = display_a2ui(view())
    expect(conformanceErrors(result.structuredContent.messages)).toEqual([])
  })

  test('wraps messages in the list envelope rather than a bare array', () => {
    const result = display_a2ui(view())
    expect(Array.isArray(result.structuredContent)).toBe(false)
    expect(Array.isArray(result.structuredContent.messages)).toBe(true)
  })

  test('hands diagnostics to a caller that asked for them', () => {
    let seen: string[] = []
    display_a2ui(Column({ children: [H1('ok')] }), {
      onDiagnostics: d => { seen = d.map(x => x.subject) },
    })
    expect(seen).toEqual([])
  })
})

describe('registerA2uiResource', () => {
  test('registers under the a2ui MIME type with a name derived from the URI', () => {
    const server = fakeServer()
    registerA2uiResource(server, view)
    expect(server.calls[0]).toMatchObject({ name: 'prefab-surface', uri: A2UI_RESOURCE_URI })
    expect(server.calls[0].config.mimeType).toBe(A2UI_MIME)
  })

  test('rejects a URI that is not an a2ui:// one', () => {
    expect(() => registerA2uiResource(fakeServer(), view, { uri: 'ui://prefab/viewer' })).toThrow(TypeError)
  })

  test('defaults to no caching, because the surface is rebuilt per read', () => {
    const server = fakeServer()
    registerA2uiResource(server, view)
    expect(server.calls[0].config.cacheHint).toEqual({ ttlMs: 0, cacheScope: 'private' })
  })

  test('rebuilds the surface on every read', async () => {
    const server = fakeServer()
    let built = 0
    registerA2uiResource(server, () => { built += 1; return view() })
    const handler = server.calls[0].handler
    await handler(new URL(A2UI_RESOURCE_URI))
    await handler(new URL(A2UI_RESOURCE_URI))
    expect(built).toBe(2)
  })

  test('serves a conformant payload with the required cache fields', async () => {
    const server = fakeServer()
    registerA2uiResource(server, view, { cache: { ttlMs: 60_000, cacheScope: 'public' } })
    const result = await server.calls[0].handler(new URL(A2UI_RESOURCE_URI))
    expect(result).toMatchObject({ ttlMs: 60_000, cacheScope: 'public' })
    const payload = JSON.parse(result.contents[0].text) as { messages: [] }
    expect(conformanceErrors(payload.messages)).toEqual([])
  })
})
