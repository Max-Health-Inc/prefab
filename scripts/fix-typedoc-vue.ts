/**
 * Post-process TypeDoc-generated markdown so VitePress's Vue compiler does not
 * choke on it. TypeDoc emits TSDoc prose verbatim, and some of it (notably the
 * rx module) contains literal `{{ ... }}` template expressions. Vue treats
 * `{{ }}` in text as an interpolation and fails to parse the contents.
 *
 * Fenced code blocks and inline-code spans are already protected: VitePress
 * adds `v-pre` to both. So we only escape `{{` / `}}` that appear in PLAIN
 * PROSE (outside ``` fences and outside `backtick` spans), turning them into
 * HTML entities that render as literal braces and are invisible to Vue.
 */
import { Glob } from 'bun'
import { readFileSync, writeFileSync } from 'node:fs'

const API_DIR = 'docs/reference/api'
const OPEN = /\{\{/g
const CLOSE = /\}\}/g

/** Escape `{{`/`}}` in the prose segments of a single line (skips `inline code`). */
function escapeProse(line: string): string {
  // Split on backticks: even indices are prose, odd indices are inline code.
  return line
    .split('`')
    .map((seg, i) =>
      i % 2 === 0 ? seg.replace(OPEN, '&#123;&#123;').replace(CLOSE, '&#125;&#125;') : seg,
    )
    .join('`')
}

function fixFile(path: string): boolean {
  const src = readFileSync(path, 'utf-8')
  let inFence = false
  let changed = false
  const out = src.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return line
    }
    if (inFence) return line
    const next = escapeProse(line)
    if (next !== line) changed = true
    return next
  })
  if (changed) writeFileSync(path, out.join('\n'))
  return changed
}

let count = 0
for (const file of new Glob('**/*.md').scanSync(API_DIR)) {
  if (fixFile(`${API_DIR}/${file}`)) count++
}
console.log(`✅ fix-typedoc-vue: escaped {{ }} in ${count} generated file(s)`)
