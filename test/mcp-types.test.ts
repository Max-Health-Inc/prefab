/**
 * Compile-time guards for SDK interop.
 *
 * prefab's MCP types exist to be returned straight from SDK handlers, and the
 * SDK's result types are passthrough (`{ [x: string]: unknown }`). TypeScript
 * grants an *implicit index signature* only to type aliases of object types,
 * never to interfaces, because declaration merging means an interface's key set
 * is not final. So declaring one of these as an `interface` silently breaks the
 * only thing it is for:
 *
 *     Type 'McpResourceReadResult<…>' is not assignable to type '{ [x: string]: unknown; … }'.
 *       Index signature for type 'string' is missing in type 'McpResourceReadResult<…>'.
 *
 * The assignments below reproduce that check without depending on the SDK: the
 * property that breaks is exactly assignability to a passthrough object, so a
 * local stand-in tests it faithfully. These fail `bun run typecheck`, not at
 * runtime — the runtime assertions only keep the file honest as a test.
 */

import { describe, it, expect } from 'bun:test'
import { display, display_error, display_form, display_success, display_update } from '../src/index'
import { Text } from '../src/index'
import type {
  McpBlobResourceContents,
  McpResourceReadResult,
  McpTextResourceContents,
  McpToolResult,
} from '../src/index'

/**
 * Stand-in for the SDK's passthrough result types (`ReadResourceResult`,
 * `CallToolResult`). `Record<string, unknown>` behaves identically to the SDK's
 * literal `{ [x: string]: unknown }` as an assignment target for this check, and
 * the real types were verified directly against `@modelcontextprotocol/server`.
 */
type SdkPassthroughResult = Record<string, unknown>

describe('SDK interop (compile-time)', () => {
  it('McpResourceReadResult flows into a passthrough result', () => {
    const read: McpResourceReadResult<McpTextResourceContents> = {
      contents: [{ uri: 'ui://prefab/viewer', mimeType: 'text/html', text: '<html>' }],
      ttlMs: 86_400_000,
      cacheScope: 'public',
    }
    // The assignment is the assertion — it does not compile if the type is
    // declared as an interface.
    const passthrough: SdkPassthroughResult = read
    expect(passthrough.ttlMs).toBe(86_400_000)
  })

  it('holds for the blob and default-union forms too', () => {
    const blob: McpResourceReadResult<McpBlobResourceContents> = {
      contents: [{ uri: 'ui://x', blob: 'AAAA' }],
      ttlMs: 0,
      cacheScope: 'private',
    }
    const either: McpResourceReadResult = blob
    const a: SdkPassthroughResult = blob
    const b: SdkPassthroughResult = either
    expect(a.cacheScope).toBe('private')
    expect(b.cacheScope).toBe('private')
  })

  it('resource contents are individually assignable', () => {
    // The contents elements are checked on their own by the SDK's array type,
    // so the alias treatment has to reach them as well as the outer result.
    const text: McpTextResourceContents = { uri: 'ui://x', text: 'hi' }
    const contents: SdkPassthroughResult = text
    expect(contents.uri).toBe('ui://x')
  })

  it('McpToolResult flows into a passthrough result', () => {
    // This one relies on an explicit `[key: string]: unknown` rather than the
    // implicit signature; the guard is here so removing it is caught too.
    const result: McpToolResult = display(Text('hi'))
    const passthrough: SdkPassthroughResult = result
    expect(Array.isArray(passthrough.content)).toBe(true)
  })

  it('the display helpers’ concrete return type is assignable', () => {
    // display() returns McpToolResult<PrefabWireFormat>; a handler returning it
    // to the SDK must not need a cast either.
    const passthrough: SdkPassthroughResult = display(Text('hi'))
    expect(passthrough.structuredContent).toBeDefined()
  })
})

/**
 * The check above is necessary but not sufficient, and the gap let a real bug
 * through.
 *
 * `SdkPassthroughResult` is flat (`Record<string, unknown>`), so `McpToolResult`
 * satisfies it via its own explicit `[key: string]: unknown` — and the value of
 * `structuredContent` is never examined. The SDK types that field specifically,
 * as `{ [x: string]: unknown }`, so a `structuredContent` whose type is an
 * interface fails there while sailing through the flat check.
 *
 * That is exactly what happened: `PrefabWireFormat` and `PrefabUpdateWire` were
 * interfaces, every display helper was unassignable to a real `CallToolResult`,
 * and the guard above stayed green. The stand-in below keeps the field shape, so
 * it fails if either wire type reverts to an interface.
 */
interface SdkCallToolResultShape {
  content: unknown[]
  structuredContent?: Record<string, unknown>
  isError?: boolean
}

describe('display helpers satisfy the SDK result FIELD shapes (compile-time)', () => {
  it('display', () => {
    const result: SdkCallToolResultShape = display(Text('hi'))
    expect(result.structuredContent).toBeDefined()
  })

  it('display_form', () => {
    const result: SdkCallToolResultShape = display_form(
      [{ name: 'name', label: 'Patient Name', required: true }],
      'create_patient',
    )
    expect(result.structuredContent).toBeDefined()
  })

  it('display_update carries PrefabUpdateWire, a second alias', () => {
    const result: SdkCallToolResultShape = display_update({ count: 1 })
    expect(result.structuredContent).toBeDefined()
  })

  it('display_error', () => {
    const result: SdkCallToolResultShape = display_error('Not Found', 'no such patient')
    expect(result.isError).toBe(true)
  })

  it('display_success', () => {
    const result: SdkCallToolResultShape = display_success('Saved', 'Patient created')
    expect(result.isError).toBeUndefined()
  })

  it('a typed handler returning a helper needs no assertion', () => {
    // The consumer-side pattern that was failing: a handler whose declared
    // return type is the SDK result, returning a helper's value unchanged.
    const handler = (): SdkCallToolResultShape => display_error('Boom', 'it broke')
    expect(handler().isError).toBe(true)
  })
})
