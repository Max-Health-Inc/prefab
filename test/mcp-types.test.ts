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
import { display } from '../src/index'
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
