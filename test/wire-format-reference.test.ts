import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { Glob } from 'bun'
import { COMPONENT_TYPES } from '../src/core/component-types.js'
import { isRecord } from '../src/core/guards.js'
import { BUILTIN_PIPES } from '../src/renderer/rx.js'
import {
  AppendState, CallHandler, CallTool, CloseOverlay, Fetch, OpenFilePicker, OpenLink, PopState,
  RequestDisplayMode, SendMessage, SetInterval, SetState, ShowToast, Subscribe, ToggleState,
  Unsubscribe, UpdateContext,
} from '../src/actions/index.js'
import type { Action } from '../src/actions/index.js'

const ROOT = join(import.meta.dir, '..')
const REFERENCES = ['docs/reference/wire-format.md', 'skills/prefab-ui/references/wire-format.md']
const EXAMPLE_SOURCES = ['README.md', 'docs/**/*.md', 'skills/**/*.md', 'docs/public/examples/*.json']

const read = (path: string): string => readFileSync(join(ROOT, path), 'utf8').replace(/\r\n/g, '\n')

const done = new CloseOverlay()
const FULLY_POPULATED: Action[] = [
  new SetState('k', 1),
  new ToggleState('k'),
  new AppendState('k', 1, 0),
  new PopState('k', 0),
  new ShowToast('m', { description: 'd', variant: 'success', duration: 1 }),
  done,
  new OpenLink('u', '_self'),
  new SetInterval(1, done),
  new Fetch('u', { method: 'POST', headers: { a: 'b' }, body: 1, resultKey: 'r' }),
  new OpenFilePicker({ accept: '*', multiple: true, resultKey: 'r' }),
  new CallHandler('h', { arguments: { a: 1 }, resultKey: 'r' }),
  new CallTool('t', { arguments: { a: 1 }, resultKey: 'r' }),
  new SendMessage('m'),
  new UpdateContext({ a: 1 }),
  new RequestDisplayMode('fullscreen'),
  new Subscribe('u', { stateKey: 's', push: false, fallbackInterval: 1, fallbackTool: 't', fallbackArgs: { a: 1 }, onData: done }),
  new Unsubscribe('u'),
]

const CALLBACKS = ['onSuccess', 'onError', 'onTick', 'onData']

const ACTION_FIELDS = new Map(FULLY_POPULATED.map((a) => {
  const { action, ...fields } = a.toJSON()
  return [action, new Set([...Object.keys(fields), 'onSuccess', 'onError'])]
}))
const CANONICAL_ACTIONS = [...ACTION_FIELDS.keys()]
const toolCallFields = ACTION_FIELDS.get('toolCall')
if (toolCallFields) ACTION_FIELDS.set('callTool', toolCallFields)

function section(md: string, heading: RegExp): string {
  const lines = md.split('\n')
  let fenced = false
  const headings = lines.map((line) => {
    if (line.startsWith('```')) fenced = !fenced
    return !fenced && /^#{1,6} /.test(line) ? line.indexOf(' ') : 0
  })
  const start = lines.findIndex((line, i) => headings[i] > 0 && heading.test(line))
  if (start < 0) throw new Error(`no heading matching ${String(heading)}`)
  const end = headings.findIndex((level, i) => i > start && level > 0 && level <= headings[start])
  return lines.slice(start + 1, end < 0 ? undefined : end).join('\n')
}

function tables(text: string): { header: string[]; rows: string[][] }[] {
  const cells = (line: string): string[] => line.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim())
  const found: { header: string[]; rows: string[][] }[] = []
  const lines = text.split('\n')
  for (let i = 0; i + 1 < lines.length; i++) {
    if (!lines[i].startsWith('|') || !/^\|[\s:|-]+\|$/.test(lines[i + 1])) continue
    const rows: string[][] = []
    let j = i + 2
    for (; j < lines.length && lines[j].startsWith('|'); j++) rows.push(cells(lines[j]))
    found.push({ header: cells(lines[i]), rows })
    i = j
  }
  return found
}

const ticked = (cell: string): string[] => [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1])
const pipeName = (token: string): string => token.split(':')[0].trim()
const sorted = (values: Iterable<string>): string[] => [...new Set(values)].sort()

function documentedTypes(md: string): string[] {
  const block = /```\n([\s\S]*?)```/.exec(section(md, /Type Names/))
  if (!block) throw new Error('no type-name block')
  return block[1].replace(/^[A-Za-z]+:/gm, '').split(/[,\s]+/).filter(Boolean)
}

function documentedActions(md: string): Map<string, string[]> {
  const table = tables(section(md, /^## Action JSON/)).find((t) => t.header.includes('Key Fields'))
  if (!table) throw new Error('no action table')
  const nameCol = table.header.findIndex((h) => /action/i.test(h))
  const fieldCol = table.header.indexOf('Key Fields')
  return new Map(table.rows.map((row) => [ticked(row[nameCol])[0], ticked(row[fieldCol]).map((f) => f.replace(/\?$/, ''))]))
}

function documentedPipes(md: string): string[] {
  const table = tables(section(md, /^### Pipes/)).find((t) => t.header[0] === 'Pipe')
  if (!table) throw new Error('no pipe table')
  return table.rows.flatMap((row) => ticked(row[0]).map(pipeName))
}

function actionObjects(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(actionObjects)
  if (!isRecord(value)) return []
  if (typeof value.action !== 'string') return Object.values(value).flatMap(actionObjects)
  return [value, ...CALLBACKS.flatMap((key) => actionObjects(value[key]))]
}

function jsonExamples(path: string): unknown[] {
  const text = read(path)
  const blocks = path.endsWith('.json') ? [text] : [...text.matchAll(/```json\n([\s\S]*?)```/g)].map((m) => m[1])
  return blocks.flatMap((block): unknown[] => {
    try {
      const parsed: unknown = JSON.parse(block)
      return [parsed]
    } catch {
      return []
    }
  })
}

describe('wire-format references match the renderer', () => {
  for (const ref of REFERENCES) {
    const md = read(ref)

    test(`${ref} lists every component type the renderer registers`, () => {
      expect(sorted(documentedTypes(md))).toEqual(sorted(COMPONENT_TYPES))
    })

    test(`${ref} documents every action, with fields its builder emits`, () => {
      const actions = documentedActions(md)
      expect(sorted(actions.keys())).toEqual(sorted(CANONICAL_ACTIONS))
      for (const [name, fields] of actions) {
        const unknown = fields.filter((f) => !ACTION_FIELDS.get(name)?.has(f))
        expect({ name, unknown }).toEqual({ name, unknown: [] })
      }
    })

    test(`${ref} lists exactly the built-in pipes`, () => {
      expect(sorted(documentedPipes(md))).toEqual(sorted(BUILTIN_PIPES))
    })
  }

  test('README lists exactly the built-in pipes', () => {
    const line = read('README.md').split('\n').find((l) => l.startsWith('**Built-in pipes:**')) ?? ''
    expect(sorted(ticked(line).map(pipeName))).toEqual(sorted(BUILTIN_PIPES))
  })

  test('both references document the same envelope fields', () => {
    const [doc, skill] = REFERENCES.map((ref) => {
      const table = tables(section(read(ref), /^## Envelope/))[0]
      return sorted(table.rows.flatMap((row) => ticked(row[0])))
    })
    expect(skill).toEqual(doc)
  })

  test('action examples only use fields their builder emits', () => {
    const files = EXAMPLE_SOURCES.flatMap((pattern) => [...new Glob(pattern).scanSync({ cwd: ROOT })])
    const offenders = files.flatMap((file) =>
      jsonExamples(file).flatMap(actionObjects).flatMap((action) => {
        const allowed = ACTION_FIELDS.get(String(action.action))
        const extra = Object.keys(action).filter((k) => k !== 'action' && !allowed?.has(k))
        return allowed && extra.length === 0 ? [] : [`${file}: ${String(action.action)} ${extra.join(', ')}`]
      }),
    )
    expect(offenders).toEqual([])
  })
})
