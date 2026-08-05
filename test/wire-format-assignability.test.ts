/**
 * Every display helper's result must drop straight into an MCP tool handler with
 * no cast.
 *
 * The MCP SDK types `CallToolResult.structuredContent` as
 * `{ [x: string]: unknown }`. TypeScript grants an implicit index signature to
 * object TYPE ALIASES but never to INTERFACES, so declaring `PrefabWireFormat`
 * or `PrefabUpdateWire` as an interface makes these results unassignable and
 * forces every consumer into a type assertion. The failure lands in consumer
 * repos, not here, which is why it is pinned.
 *
 * These are compile-time assertions first: the annotated `const` declarations
 * fail `bun run typecheck` if the wire types regress to interfaces. The runtime
 * expectations keep the file honest as a test.
 */

import { describe, expect, test } from 'bun:test'
import { display, display_error, display_form, display_success, display_update } from '../src/mcp/display.js'
import { Text } from '../src/components/typography/index.js'

/**
 * The shape the SDK gives `CallToolResult`, declared locally so this test adds no
 * dependency (prefab ships zero).
 */
interface SdkCallToolResult {
  content: unknown[]
  // `Record<string, unknown>` is structurally identical to the SDK's
  // `{ [x: string]: unknown }` for assignability, and satisfies this repo's
  // consistent-indexed-object-style rule.
  structuredContent?: Record<string, unknown>
  isError?: boolean
}

describe('display helpers are assignable to the MCP SDK result shape', () => {
  test('display', () => {
    const result: SdkCallToolResult = display(Text('hello'))
    expect(result.structuredContent).toBeDefined()
  })

  test('display_form', () => {
    const result: SdkCallToolResult = display_form(
      [{ name: 'name', label: 'Patient Name', required: true }],
      'create_patient',
    )
    expect(result.structuredContent).toBeDefined()
  })

  test('display_update', () => {
    const result: SdkCallToolResult = display_update({ count: 1 })
    expect(result.structuredContent).toBeDefined()
  })

  test('display_error sets isError', () => {
    const result: SdkCallToolResult = display_error('Not Found', 'no such patient')
    expect(result.isError).toBe(true)
  })

  test('display_success', () => {
    const result: SdkCallToolResult = display_success('Saved', 'Patient created')
    expect(result.isError).toBeUndefined()
  })

  test('a handler returning the result needs no assertion', () => {
    // The consumer-side pattern that was failing: a typed handler whose return
    // value is a display helper's result, passed through unchanged.
    const handler = (): SdkCallToolResult => display_error('Boom', 'it broke')
    expect(handler().isError).toBe(true)
  })
})
