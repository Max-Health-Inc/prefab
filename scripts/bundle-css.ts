import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const IMPORT_RE = /^@import\s+["'](.+?)["'];\s*$/gm
const ENTRY = resolve(dirname(fileURLToPath(import.meta.url)), '../src/prefab.css')

function inline(file: string, seen: Set<string>): string {
  if (seen.has(file)) throw new Error(`bundle-css: circular @import of ${file}`)
  seen.add(file)
  const source = readFileSync(file, 'utf8')
  return source.replace(IMPORT_RE, (_, rel: string) => inline(resolve(dirname(file), rel), seen).trimEnd() + '\n')
}

export function bundleCss(entry: string = ENTRY): string {
  return inline(entry, new Set())
}
