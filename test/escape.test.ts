import { describe, expect, test } from 'bun:test'
import { escapeHtml } from '../src/core/escape.js'

describe('escapeHtml', () => {
  // The contract, not the prose: this replaced three copies that each escaped a
  // different subset (`& < > "`, `& < >`, and `& "`). Each was correct only for
  // its own call site, and nothing stopped the next edit from narrowing one
  // further. Pinning all five characters is what makes one shared helper safe to
  // call from any context.
  test('escapes all five HTML-significant characters', () => {
    expect(escapeHtml(`& < > " '`)).toBe('&amp; &lt; &gt; &quot; &#39;')
  })

  test('escapes the ampersand first, so entities are not double-decoded', () => {
    // Naive sequential replacement that handles `&` last turns `<` into `&lt;`
    // and then into `&amp;lt;`, which renders as literal text instead of markup.
    expect(escapeHtml('<')).toBe('&lt;')
    expect(escapeHtml('&lt;')).toBe('&amp;lt;')
  })

  test('neutralizes an attribute break-out in either quote style', () => {
    expect(escapeHtml('" onerror=alert(1) x="')).not.toContain('"')
    expect(escapeHtml("' onerror=alert(1) x='")).not.toContain("'")
  })

  test('leaves text with no significant characters untouched', () => {
    expect(escapeHtml('plain text 123')).toBe('plain text 123')
    expect(escapeHtml('')).toBe('')
  })

  test('escapes every occurrence, not just the first', () => {
    expect(escapeHtml('<<>>')).toBe('&lt;&lt;&gt;&gt;')
  })
})
