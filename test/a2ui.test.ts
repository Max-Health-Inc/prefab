/**
 * A2UI emitter conformance.
 *
 * Every view in `VIEWS` is emitted and validated against the official A2UI
 * v1.0 JSON Schemas plus the structural rules from the upstream conformance
 * suite. The list is meant to cover one view per mapper family, so a mapping
 * that starts emitting something the catalog rejects fails here rather than in
 * a renderer.
 */

import { describe, expect, test } from 'bun:test'
import { PrefabApp } from '../src/app.js'
import { Column, Row, Div } from '../src/components/layout/index.js'
import { H1, H3, Text, Muted, Code, BlockQuote, Link } from '../src/components/typography/index.js'
import { Card, CardContent } from '../src/components/card/index.js'
import { Alert, AlertTitle, AlertDescription } from '../src/components/alert/index.js'
import { Input, Textarea, Checkbox, Select, SelectOption, Slider, Button, DatePicker } from '../src/components/form/index.js'
import { Tabs, Tab, Dialog } from '../src/components/interactive/index.js'
import { Image, Video, Audio } from '../src/components/media/index.js'
import { Badge, Icon, Separator, Metric, DataTable, col } from '../src/components/data/index.js'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../src/components/table/index.js'
import { LineChart } from '../src/components/charts/index.js'
import { autoTable } from '../src/auto/index.js'
import { CallTool, SendMessage } from '../src/actions/mcp.js'
import { SetState, OpenLink } from '../src/actions/client.js'
import { emitA2UI } from '../src/a2ui/emit.js'
import { escapePointerToken, toBinding, toJsonPointer } from '../src/a2ui/expr.js'
import { A2UI_BASIC_CATALOG, A2UI_ROOT_ID, type A2uiComponent } from '../src/a2ui/types.js'
import { allComponents, conformanceErrors } from './helpers/a2ui-validator.js'
import type { Component } from '../src/core/component.js'

const ROWS = [
  { id: '1', name: 'Ada', role: 'admin' },
  { id: '2', name: 'Linus', role: 'user' },
]

const VIEWS: Record<string, Component> = {
  typography: Column({ children: [
    H1('Title'), H3('Subtitle'), Text('Body copy'), Muted('Quiet'),
    Code('npm i'), BlockQuote('Quoted'), Badge('new'),
  ] }),
  layout: Div({ children: [Row({ align: 'center', children: [Text('left'), Text('right')] })] }),
  card: Card({ children: [CardContent({ children: [Text('inside'), Separator()] })] }),
  alert: Alert({ variant: 'destructive', children: [AlertTitle('Nope'), AlertDescription('It failed')] }),
  form: Column({ children: [
    Input({ name: 'email', label: 'Email', inputType: 'email', placeholder: 'you@example.com' }),
    Textarea({ name: 'bio', label: 'Bio' }),
    Checkbox({ name: 'agree', label: 'I agree' }),
    Select({ name: 'role', label: 'Role', children: [SelectOption('admin', 'Admin'), SelectOption('user', 'User')] }),
    Slider({ name: 'volume', label: 'Volume', min: 0, max: 10, step: 2 }),
    DatePicker({ name: 'when', label: 'When' }),
    Button('Save', { onClick: new CallTool('save', { arguments: { email: '{{ email }}' } }) }),
  ] }),
  media: Column({ children: [
    Image({ src: 'https://example.com/a.png', alt: 'An image' }),
    Video('https://example.com/a.mp4'),
    Audio('https://example.com/a.mp3'),
    Icon('mail'),
  ] }),
  interactive: Column({ children: [
    Tabs({ children: [Tab({ title: 'One', children: [Text('first')] }), Tab({ title: 'Two', children: [Text('second')] })] }),
    Dialog({ title: 'Confirm', children: [Text('Are you sure?')] }),
  ] }),
  metric: Metric({ label: 'Revenue', value: '42' }),
  link: Link('Docs', { href: 'https://example.com' }),
  staticTable: Table({ children: [
    TableHead({ children: [TableRow({ children: [TableHeader('Name'), TableHeader('Role')] })] }),
    TableBody({ children: [TableRow({ children: [
      TableCell({ children: [Text('Ada')] }),
      TableCell({ children: [Text('admin')] }),
    ] })] }),
  ] }),
  dataTable: DataTable({ rows: '{{ people }}', columns: [col('name', 'Name'), col('role', 'Role')] }),
  autoTable: autoTable(ROWS),
  actions: Column({ children: [
    Button('Ask', { onClick: new SendMessage('hello') }),
    Button('Open', { onClick: new OpenLink('https://example.com') }),
    Button('Toggle', { onClick: new SetState('open', true) }),
  ] }),
}

describe('A2UI conformance', () => {
  for (const [name, view] of Object.entries(VIEWS)) {
    test(`${name} emits a conformant surface`, () => {
      const app = new PrefabApp({ view, state: { people: ROWS, email: '', open: false } })
      const { messages } = app.toA2UI()
      expect(conformanceErrors(messages)).toEqual([])
    })
  }

  test('streamed output conforms too', () => {
    const app = new PrefabApp({ view: VIEWS.form, state: { email: '' } })
    const { messages } = app.toA2UI({ stream: true })
    expect(messages).toHaveLength(3)
    expect(conformanceErrors(messages)).toEqual([])
  })
})

describe('expression binding', () => {
  test('escapes JSON Pointer reference tokens', () => {
    // RFC 6901: `~` becomes `~0` and `/` becomes `~1`, and the order matters —
    // escaping the slash first would re-escape its `~1` into `~01`.
    expect(escapePointerToken('a/b')).toBe('a~1b')
    expect(escapePointerToken('a~b')).toBe('a~0b')
    expect(escapePointerToken('a~/b')).toBe('a~0~1b')
    expect(toJsonPointer(['x/y', 'z'])).toBe('/x~1y/z')
  })

  test('binds a state key containing pointer syntax', () => {
    const { messages } = new PrefabApp({
      view: Text('{{ weird }}'),
      state: { weird: 'v' },
    }).toA2UI()
    const root = allComponents(messages).find(c => c.id === A2UI_ROOT_ID)
    expect(root?.text).toEqual({ path: '/weird' })
  })

  test('treats a leading state. prefix as the data-model root', () => {
    expect(toBinding('{{ state.count }}')).toEqual({ kind: 'binding', value: { path: '/count' } })
  })

  test('interpolates mixed literal and template text through formatString', () => {
    expect(toBinding('Hello {{ name }}')).toEqual({
      kind: 'format',
      value: { call: 'formatString', args: { value: 'Hello ${/name}' } },
    })
  })

  test('refuses the whole string when an embedded expression is too rich', () => {
    // Interpolating the bindable half and dropping the rest would change what
    // the text says without saying so.
    expect(toBinding('Hello {{ a + b }}').kind).toBe('unbindable')
  })

  test('passes a plain literal through untouched', () => {
    expect(toBinding('just text')).toEqual({ kind: 'literal', value: 'just text' })
  })

  test('rejects anything richer than a member path', () => {
    // A formatting pipe is the exception, since A2UI's catalog has the function
    // it corresponds to; see `a2ui-pipes.test.ts`. Arithmetic, conditionals and
    // calls have no equivalent at all.
    for (const expr of ['{{ a + 1 }}', "{{ x ? 'y' : 'z' }}", '{{ f() }}', '{{ s | truncate:10 }}']) {
      expect(toBinding(expr).kind, expr).toBe('unbindable')
    }
  })

  test('accepts indexed member paths', () => {
    expect(toBinding('{{ items.0.label }}')).toEqual({ kind: 'binding', value: { path: '/items/0/label' } })
  })
})

describe('A2UI emitter', () => {
  const emit = (view: Component, state?: Record<string, unknown>) =>
    new PrefabApp({ view, state }).toA2UI()

  test('names the entry component root and targets the Basic catalog', () => {
    const { messages } = emit(Text('hi'))
    const first = messages[0]
    expect('createSurface' in first && first.createSurface.catalogId).toBe(A2UI_BASIC_CATALOG)
    expect(allComponents(messages).some(c => c.id === A2UI_ROOT_ID)).toBe(true)
  })

  test('is deterministic', () => {
    const build = () => emit(VIEWS.form, { email: '' }).messages
    expect(JSON.stringify(build())).toBe(JSON.stringify(build()))
  })

  test('unwraps the app root rather than emitting a redundant Column', () => {
    const { messages } = emit(Text('solo'))
    const root = allComponents(messages).find(c => c.id === A2UI_ROOT_ID)
    expect(root?.component).toBe('Text')
  })

  test('binds a plain template to a JSON Pointer', () => {
    const { messages } = emit(Text('{{ user.name }}'), { user: { name: 'Ada' } })
    const root = allComponents(messages).find(c => c.id === A2UI_ROOT_ID)
    expect(root?.text).toEqual({ path: '/user/name' })
  })

  test('reports an expression too rich for a binding', () => {
    const { diagnostics } = emit(Text('{{ count + 1 }}'), { count: 1 })
    expect(diagnostics.some(d => d.kind === 'expression')).toBe(true)
  })

  test('keeps prefab state as the surface data model', () => {
    const { messages } = emit(Text('hi'), { a: 1, b: 'two' })
    const first = messages[0]
    expect('createSurface' in first && first.createSurface.dataModel).toEqual({ a: 1, b: 'two' })
  })

  test('renders a DataTable as a templated list rather than inlined rows', () => {
    const { messages } = emit(DataTable({ rows: '{{ people }}', columns: [col('name', 'Name')] }), { people: ROWS })
    const templated = allComponents(messages).find(c => {
      const children: unknown = c.children
      return children != null && !Array.isArray(children) && typeof children === 'object'
    })
    expect(templated?.children).toEqual({ path: '/people', componentId: expect.any(String) })
  })

  test('seeds literal autoTable rows into the data model', () => {
    const { messages } = emit(autoTable(ROWS))
    const first = messages[0]
    const dataModel = 'createSurface' in first ? first.createSurface.dataModel : undefined
    expect(dataModel?.rows).toEqual(ROWS)
  })

  test('binds a tool call argument instead of shipping the template', () => {
    const { messages } = emit(
      Button('Go', { onClick: new CallTool('search', { arguments: { q: '{{ query }}' } }) }),
      { query: '' },
    )
    const button = allComponents(messages).find(c => c.component === 'Button')
    expect(button?.action).toEqual({ event: { name: 'search', context: { q: { path: '/query' } } } })
  })

  test('turns a link into a borderless button running openUrl', () => {
    const { messages } = emit(Link('Docs', { href: 'https://example.com' }))
    const button = allComponents(messages).find(c => c.component === 'Button')
    expect(button?.action).toEqual({ functionCall: { call: 'openUrl', args: { url: 'https://example.com' } } })
  })

  test('reports charts as unsupported instead of emitting something invalid', () => {
    const { messages, diagnostics } = emit(Column({ children: [Text('ok'), LineChart({ data: [], series: [] })] }))
    expect(diagnostics.some(d => d.kind === 'unsupported' && d.subject === 'LineChart')).toBe(true)
    expect(conformanceErrors(messages)).toEqual([])
  })

  test('degrades an unknown component instead of dropping the tree', () => {
    const { messages, diagnostics } = emitA2UI({
      $prefab: { version: '0.3' },
      view: { type: 'SomethingNew', children: [{ type: 'Text', content: 'still here' }] },
    })
    expect(diagnostics.some(d => d.kind === 'degraded' && d.subject === 'SomethingNew')).toBe(true)
    expect(allComponents(messages).some((c: A2uiComponent) => c.text === 'still here')).toBe(true)
  })

  test('honours author-supplied component ids', () => {
    const { messages } = emit(Column({ children: [Text('a', { id: 'my-text' })] }))
    expect(allComponents(messages).some(c => c.id === 'my-text')).toBe(true)
  })

  test('reports a view that could not be expressed at all', () => {
    const { diagnostics } = emit(LineChart({ data: [], series: [] }))
    expect(diagnostics.some(d => d.subject === 'view')).toBe(true)
  })
})
