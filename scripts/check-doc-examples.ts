/**
 * Typecheck the fenced `ts` examples in the docs.
 *
 * Blocks are fragments, so each is wrapped in an async function with the whole
 * public API in scope (derived from `src/index.ts`). Identifiers the examples
 * invent (`patients`, `db`) are read off the compiler's "Cannot find name"
 * diagnostics and declared, then the check re-runs.
 *
 * Opt a block out with `<!-- doccheck: skip — why -->` before the fence.
 *
 * Run:  bun run scripts/check-doc-examples.ts
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Glob } from 'bun'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const workDir = join(repoRoot, '.doccheck')
const PACKAGE_NAME = '@maxhealth.tech/prefab'
const MAX_RESOLVE_PASSES = 6

/** Diagnostics that mean 'the example invented this name'. */
const AUTO_DECLARE = new Set(['TS2304', 'TS2552', 'TS18004'])

/** Must be reported, or semantic checking never ran. */
const CANARY = '__canary.ts'
const CANARY_SRC = 'export const n: number = "not a number"\n'

interface Block {
  doc: string
  /** 1-based line of the first code line. */
  startLine: number
  code: string
  id: string
}

const FENCE = /^```(ts|typescript)\s*$/
const SKIP = /<!--\s*doccheck:\s*skip/i

function extractBlocks(doc: string, source: string): Block[] {
  const lines = source.split(/\r?\n/)
  const blocks: Block[] = []
  let i = 0
  let n = 0

  while (i < lines.length) {
    if (!FENCE.test((lines[i] ?? '').trim())) {
      i++
      continue
    }
    let probe = i - 1
    while (probe >= 0 && (lines[probe] ?? '').trim().length === 0) probe--
    const skipped = probe >= 0 && SKIP.test(lines[probe] ?? '')

    const body: string[] = []
    let j = i + 1
    while (j < lines.length && (lines[j] ?? '').trim() !== '```') {
      body.push(lines[j] ?? '')
      j++
    }
    if (!skipped && body.join('').trim().length > 0) {
      blocks.push({
        doc,
        startLine: i + 2,
        code: body.join('\n'),
        id: `${doc.replace(/[^a-zA-Z0-9]/g, '_')}__${n}`,
      })
      n++
    }
    i = j + 1
  }
  return blocks
}

/** Value + type export names, read from the barrel so they cannot go stale. */
async function apiNames(): Promise<{ values: string[]; types: string[] }> {
  const mod: Record<string, unknown> = await import(join(repoRoot, 'src', 'index.ts'))
  const values = Object.keys(mod)
    .filter((k) => k !== 'default' && /^[A-Za-z_$][\w$]*$/.test(k))
    .sort()

  // Types erase at runtime; take them from the export clauses.
  const barrel = readFileSync(join(repoRoot, 'src', 'index.ts'), 'utf8')
  const types = new Set<string>()
  for (const m of barrel.matchAll(/export\s+type\s*\{([^}]+)\}/g)) {
    for (const raw of (m[1] ?? '').split(',')) {
      const name = raw.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Z][\w$]*$/.test(name)) types.add(name)
    }
  }
  for (const m of barrel.matchAll(/export\s*\{[^}]*?\btype\s+([A-Z][\w$]*)/g)) {
    if (m[1]) types.add(m[1])
  }
  const valueSet = new Set(values)
  return { values, types: [...types].filter((t) => !valueSet.has(t)).sort() }
}

const IMPORT_RE =
  /^[ \t]*import\s(?:(?:type\s)?[\s\S]*?from\s*)?['"][^'"]+['"];?[ \t]*$/gm

/** Bindings a block already imports, so the injected API does not collide. */
function importedNames(imports: string[]): Set<string> {
  const names = new Set<string>()
  for (const stmt of imports) {
    for (const m of stmt.matchAll(/\{([^}]*)\}/g)) {
      for (const raw of (m[1] ?? '').split(',')) {
        const name = raw.replace(/\btype\b/, '').trim().split(/\s+as\s+/).pop()?.trim()
        if (name) names.add(name)
      }
    }
    const ns = /import\s+(?:\*\s+as\s+)?([A-Za-z_$][\w$]*)\s+from/.exec(stmt)
    if (ns?.[1]) names.add(ns[1])
  }
  return names
}

/** Imports must sit at top level, so lift them out of the wrapper. */
function splitImports(code: string): { imports: string[]; body: string } {
  const imports: string[] = []
  const body = code.replace(IMPORT_RE, (m) => {
    imports.push(m.trim())
    return ''
  })
  return { imports, body }
}

function emit(block: Block, api: { values: string[]; types: string[] }, declare: string[]): string {
  const src = relative(workDir, join(repoRoot, 'src', 'index.ts'))
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '.js')
  const { imports, body } = splitImports(block.code)

  // Inject the rest of the API around whatever the block imports itself, so an
  // unimported `Text` resolves to prefab's rather than the DOM global.
  const own = importedNames(imports)
  const values = api.values.filter((v) => !own.has(v))
  const types = api.types.filter((t) => !own.has(t))
  const preamble = [
    ...imports,
    values.length > 0 ? `import { ${values.join(', ')} } from '${src}'` : '',
    types.length > 0 ? `import type { ${types.join(', ')} } from '${src}'` : '',
  ]

  return [
    `// GENERATED from ${block.doc}:${block.startLine}`,
    '/* eslint-disable */',
    ...preamble,
    declare.map((d) => `declare const ${d}: any`).join('\n'),
    '',
    'export async function __example(): Promise<unknown> {',
    body,
    '  return undefined',
    '}',
  ]
    .filter((s) => s !== '')
    .join('\n')
}

function tsconfig(): string {
  const srcDir = relative(workDir, join(repoRoot, 'src')).replace(/\\/g, '/')
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'preserve',
        moduleResolution: 'bundler',
        strict: true,
        // Examples omit callback param types; arity and shape are the point here.
        noImplicitAny: false,
        noEmit: true,
        skipLibCheck: true,
        types: [],
        // No `baseUrl`: deprecated in TS 6, and TS5101 aborts the run before any
        // type checking. `paths` resolves relative to this file without it.
        // Extensionless targets: bundler resolution rejects explicit `.ts` here.
        paths: {
          [PACKAGE_NAME]: [`${srcDir}/index`],
          [`${PACKAGE_NAME}/*`]: [`${srcDir}/*`, `${srcDir}/*/index`],
        },
      },
      include: ['*.ts'],
    },
    null,
    2,
  )
}

interface Diag {
  file: string
  line: number
  code: string
  message: string
}

const DIAG = /^(?:.*[/\\])?([\w.]+\.ts)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.*)$/
const CONFIG_ERROR = /tsconfig\.json\(\d+,\d+\):\s*error/

function parseDiags(output: string): Diag[] {
  const out: Diag[] = []
  for (const line of output.split(/\r?\n/)) {
    const m = DIAG.exec(line.trim())
    if (m?.[1] && m[2] && m[4] && m[5]) {
      out.push({ file: m[1], line: Number(m[2]), code: m[4], message: m[5] })
    }
  }
  return out
}

async function runTsc(): Promise<string> {
  const proc = Bun.spawn(['bunx', 'tsc', '-p', 'tsconfig.json'], {
    cwd: workDir,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ])
  await proc.exited
  return stdout + stderr
}

export async function checkDocExamples(): Promise<number> {
  const docs: string[] = []
  for (const pattern of ['docs/**/*.md', 'README.md', 'skills/**/*.md']) {
    for await (const f of new Glob(pattern).scan({ cwd: repoRoot })) {
      const posix = f.replace(/\\/g, '/')
      if (posix.includes('.vitepress/') || posix.includes('/api/')) continue
      docs.push(posix)
    }
  }
  docs.sort()

  const blocks = docs.flatMap((d) => extractBlocks(d, readFileSync(join(repoRoot, d), 'utf8')))
  if (blocks.length === 0) {
    console.error('✖ No fenced ts examples found — glob or fence pattern is wrong.')
    return 1
  }

  const api = await apiNames()

  rmSync(workDir, { recursive: true, force: true })
  mkdirSync(workDir, { recursive: true })
  writeFileSync(join(workDir, 'tsconfig.json'), tsconfig(), 'utf8')
  writeFileSync(join(workDir, CANARY), CANARY_SRC, 'utf8')

  const byFile = new Map<string, Block>()
  const declared = new Map<string, string[]>()
  for (const b of blocks) {
    byFile.set(`${b.id}.ts`, b)
    declared.set(`${b.id}.ts`, [])
  }

  // Line of the wrapper, per file, so diagnostics map back to the markdown even
  // after a file is quarantined.
  const bodyLine = new Map<string, number>()

  let raw = ''
  let diags: Diag[] = []
  for (let pass = 0; pass < MAX_RESOLVE_PASSES; pass++) {
    for (const [file, block] of byFile) {
      const text = emit(block, api, declared.get(file) ?? [])
      bodyLine.set(
        file,
        text.split('\n').findIndex((l) => l.startsWith('export async function __example')) + 1,
      )
      writeFileSync(join(workDir, file), text, 'utf8')
    }
    raw = await runTsc()
    diags = parseDiags(raw)

    let added = false
    for (const d of diags) {
      if (!AUTO_DECLARE.has(d.code)) continue
      const name = /Cannot find name '([^']+)'/.exec(d.message)?.[1]
      if (!name) continue
      const list = declared.get(d.file)
      if (list && !list.includes(name)) {
        list.push(name)
        added = true
      }
    }
    if (!added) break
  }

  if (CONFIG_ERROR.test(raw)) {
    console.error('✖ tsconfig was rejected, so nothing was type checked:\n')
    console.error(raw.trim())
    return 1
  }

  // A syntax error anywhere aborts semantic analysis for the whole program, so
  // drop those blocks and re-run to reach the rest.
  const syntaxBad = new Map<string, Diag>()
  for (const d of diags) {
    if (/^TS1\d{3}$/.test(d.code) && d.file !== CANARY && !syntaxBad.has(d.file)) {
      syntaxBad.set(d.file, d)
    }
  }
  if (syntaxBad.size > 0) {
    for (const file of syntaxBad.keys()) rmSync(join(workDir, file), { force: true })
    raw = await runTsc()
    diags = parseDiags(raw)
  }

  if (!diags.some((d) => d.file === CANARY)) {
    console.error('✖ The canary type error was not reported — semantic checking did not run.\n')
    console.error(raw.trim())
    return 1
  }

  const real = diags.filter(
    (d) => d.file !== CANARY && !AUTO_DECLARE.has(d.code),
  )
  for (const d of syntaxBad.values()) real.push(d)

  if (real.length === 0) {
    rmSync(workDir, { recursive: true, force: true })
    console.log(`✅ Doc examples typecheck (${blocks.length} blocks, ${docs.length} files)`)
    return 0
  }

  const grouped = new Map<string, Diag[]>()
  for (const d of real) {
    const block = byFile.get(d.file)
    if (!block) continue
    if (!grouped.has(block.doc)) grouped.set(block.doc, [])
    grouped.get(block.doc)?.push(d)
  }

  console.error(`\n✖ ${real.length} error(s) in fenced ts examples:\n`)
  for (const [doc, ds] of [...grouped].sort()) {
    for (const d of ds) {
      const block = byFile.get(d.file)
      if (!block) continue
      const line = block.startLine + Math.max(0, d.line - (bodyLine.get(d.file) ?? 0) - 1)
      console.error(`  ${doc}:${line}  ${d.code}  ${d.message}`)
    }
    console.error('')
  }
  console.error('  Generated sources kept in .doccheck/.')
  console.error('  Skip a block with: <!-- doccheck: skip — why -->\n')
  return 1
}

if (import.meta.main) {
  process.exit(await checkDocExamples())
}
