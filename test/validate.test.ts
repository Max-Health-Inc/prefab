/**
 * Tests for wire format validation and new v0.5 features.
 */
import { describe, test, expect } from 'bun:test'
import { validateWireFormat, isValidWireFormat } from '../src/core/validate'
import { PrefabApp } from '../src/app'
import { H1, Text } from '../src/index'
import { Define, Use, Slot } from '../src/components/control/index'
import { Table, TableRow, TableCell, TableHead, TableBody, TableHeader } from '../src/components/table/index'
import { Radio, RadioGroup, Combobox, ComboboxOption, Calendar, DatePicker, Field, FieldTitle, FieldDescription, FieldContent, ChoiceCard } from '../src/components/form/index'
import { RadialChart, Histogram } from '../src/components/charts/index'
import { Fetch, OpenFilePicker, CallHandler } from '../src/actions/client'
import { RequestDisplayMode } from '../src/actions/mcp'

// ── Wire Format Validation ───────────────────────────────────────────────────

describe('validateWireFormat', () => {
  test('valid minimal wire data', () => {
    const data = {
      $prefab: { version: '0.2' },
      view: { type: 'Div' },
    }
    const result = validateWireFormat(data)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  test('valid full wire data', () => {
    const data = {
      $prefab: { version: '0.2' },
      view: {
        type: 'Column',
        children: [
          { type: 'H1', content: 'Hello' },
          { type: 'Text', content: '{{ state.msg }}' },
        ],
      },
      state: { msg: 'world' },
      theme: { light: { primary: '#3b82f6' }, dark: { primary: '#60a5fa' } },
      defs: { myTemplate: { type: 'Badge', content: 'OK' } },
      keyBindings: { 'ctrl+s': { type: 'CallTool', tool: 'save' } },
    }
    expect(validateWireFormat(data).valid).toBe(true)
  })

  test('rejects null', () => {
    const result = validateWireFormat(null)
    expect(result.valid).toBe(false)
    expect(result.errors[0].message).toContain('non-null object')
  })

  test('rejects missing $prefab header', () => {
    const result = validateWireFormat({ view: { type: 'Div' } })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.path.includes('$prefab'))).toBe(true)
  })

  test('rejects missing view', () => {
    const result = validateWireFormat({ $prefab: { version: '0.2' } })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.message.includes('view'))).toBe(true)
  })

  test('rejects component without type', () => {
    const result = validateWireFormat({
      $prefab: { version: '0.2' },
      view: { content: 'no type' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.message.includes('type'))).toBe(true)
  })

  test('validates children recursively', () => {
    const result = validateWireFormat({
      $prefab: { version: '0.2' },
      view: {
        type: 'Column',
        children: [{ noType: true }],
      },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.path.includes('children[0]'))).toBe(true)
  })

  test('validates action props', () => {
    const result = validateWireFormat({
      $prefab: { version: '0.2' },
      view: { type: 'Button', onClick: 'not-an-object' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.path.includes('onClick'))).toBe(true)
  })

  test('validates action arrays', () => {
    const result = validateWireFormat({
      $prefab: { version: '0.2' },
      view: {
        type: 'Button',
        onClick: [
          { type: 'SetState', key: 'x', value: 1 },
          { type: 'ShowToast', message: 'ok' },
        ],
      },
    })
    expect(result.valid).toBe(true)
  })

  test('strict mode warns on unknown types', () => {
    const result = validateWireFormat(
      {
        $prefab: { version: '0.2' },
        view: { type: 'MagicWidget' },
      },
      { strict: true },
    )
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.message.includes('Unknown component type'))).toBe(true)
  })

  test('non-strict allows unknown types', () => {
    const result = validateWireFormat({
      $prefab: { version: '0.2' },
      view: { type: 'MagicWidget' },
    })
    expect(result.valid).toBe(true)
  })

  test('validates theme structure', () => {
    const result = validateWireFormat({
      $prefab: { version: '0.2' },
      view: { type: 'Div' },
      theme: { light: 'not-an-object' },
    })
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.path.includes('theme.light'))).toBe(true)
  })

  test('isValidWireFormat shorthand', () => {
    expect(isValidWireFormat({ $prefab: { version: '0.2' }, view: { type: 'Div' } })).toBe(true)
    expect(isValidWireFormat(null)).toBe(false)
    expect(isValidWireFormat({})).toBe(false)
  })
})

// ── Stylesheets in Wire Format ───────────────────────────────────────────────

describe('stylesheets wire format', () => {
  test('PrefabApp serializes stylesheets', () => {
    const app = new PrefabApp({
      view: H1('Test'),
      stylesheets: ['.custom { color: red; }', '.other { margin: 0; }'],
    })
    const wire = app.toJSON()
    expect(wire.stylesheets).toEqual(['.custom { color: red; }', '.other { margin: 0; }'])
  })

  test('PrefabApp omits empty stylesheets', () => {
    const app = new PrefabApp({ view: H1('Test') })
    const wire = app.toJSON()
    expect(wire.stylesheets).toBeUndefined()
  })
})

// ── New Component Serialization ──────────────────────────────────────────────

describe('table components', () => {
  test('Table serializes', () => {
    const t = Table({
      children: [
        TableHead({ children: [TableRow({ children: [TableHeader('Name'), TableHeader('Age')] })] }),
        TableBody({ children: [TableRow({ children: [TableCell({ children: [] })] })] }),
      ],
    })
    const json = t.toJSON()
    expect(json.type).toBe('Table')
    expect(json.children).toHaveLength(2)
    expect(json.children![0].type).toBe('TableHead')
    expect(json.children![1].type).toBe('TableBody')
  })
})

describe('form extensions', () => {
  test('Radio serializes', () => {
    const r = Radio({ value: 'a', label: 'Option A' })
    const json = r.toJSON()
    expect(json.type).toBe('Radio')
    expect(json.value).toBe('a')
    expect(json.label).toBe('Option A')
  })

  test('RadioGroup serializes', () => {
    const g = RadioGroup({ name: 'color', label: 'Color',
      children: [
        Radio({ value: 'red', label: 'Red' }),
        Radio({ value: 'blue', label: 'Blue' }),
      ],
    })
    const json = g.toJSON()
    expect(json.type).toBe('RadioGroup')
    expect(json.name).toBe('color')
    expect(json.children).toHaveLength(2)
  })

  test('Combobox serializes', () => {
    const c = Combobox({ name: 'fruit', placeholder: 'Pick...',
      children: [
        ComboboxOption('apple', 'Apple'),
      ],
    })
    const json = c.toJSON()
    expect(json.type).toBe('Combobox')
    expect(json.children).toHaveLength(1)
  })

  test('Calendar serializes', () => {
    const c = Calendar({ name: 'date', minDate: '2024-01-01' })
    const json = c.toJSON()
    expect(json.type).toBe('Calendar')
    expect(json.minDate).toBe('2024-01-01')
  })

  test('DatePicker serializes', () => {
    const d = DatePicker({ name: 'dob', placeholder: 'Select date' })
    expect(d.toJSON().type).toBe('DatePicker')
  })

  test('Field serializes', () => {
    const f = Field({ children: [
      FieldTitle('Email'),
      FieldDescription('Your email address'),
      FieldContent({ children: [Text('test@example.com')] }),
    ] })
    const json = f.toJSON()
    expect(json.type).toBe('Field')
    expect(json.children).toHaveLength(3)
  })

  test('ChoiceCard serializes', () => {
    const c = ChoiceCard({ value: 'plan-a', label: 'Basic', description: '$10/mo' })
    const json = c.toJSON()
    expect(json.type).toBe('ChoiceCard')
    expect(json.label).toBe('Basic')
    expect(json.value).toBe('plan-a')
  })
})

describe('chart extensions', () => {
  test('RadialChart serializes', () => {
    const r = RadialChart({ data: [1, 2, 3], series: [{ dataKey: 'val' }], innerRadius: 40 })
    const json = r.toJSON()
    expect(json.type).toBe('RadialChart')
    expect(json.innerRadius).toBe(40)
  })

  test('Histogram serializes', () => {
    const h = Histogram({ data: [1, 2, 3, 4, 5], bins: 5, color: '#ff0000' })
    const json = h.toJSON()
    expect(json.type).toBe('Histogram')
    expect(json.bins).toBe(5)
    expect(json.data).toEqual([1, 2, 3, 4, 5])
  })
})

describe('composition components', () => {
  test('Define serializes', () => {
    const d = Define({ name: 'myTemplate', children: [Text('Hello')] })
    const json = d.toJSON()
    expect(json.type).toBe('Define')
    expect(json.name).toBe('myTemplate')
    expect(json.children).toHaveLength(1)
  })

  test('Use serializes', () => {
    const u = Use({ def: 'myTemplate', overrides: { color: 'red' } })
    const json = u.toJSON()
    expect(json.type).toBe('Use')
    expect(json.def).toBe('myTemplate')
    expect(json.overrides).toEqual({ color: 'red' })
  })

  test('Slot serializes', () => {
    const s = Slot({ name: 'header' })
    const json = s.toJSON()
    expect(json.type).toBe('Slot')
    expect(json.name).toBe('header')
  })
})

// ── New Actions ──────────────────────────────────────────────────────────────

describe('new actions', () => {
  test('Fetch serializes', () => {
    const a = new Fetch('https://api.example.com/data', { method: 'POST', resultKey: 'result' })
    const json = a.toJSON()
    expect(json.action).toBe('fetch')
    expect(json.url).toBe('https://api.example.com/data')
    expect(json.method).toBe('POST')
    expect(json.resultKey).toBe('result')
  })

  test('OpenFilePicker serializes', () => {
    const a = new OpenFilePicker({ accept: '.csv,.json', multiple: true, resultKey: 'files' })
    const json = a.toJSON()
    expect(json.action).toBe('openFilePicker')
    expect(json.accept).toBe('.csv,.json')
    expect(json.multiple).toBe(true)
  })

  test('CallHandler serializes', () => {
    const a = new CallHandler('onSave', { arguments: { data: 'test' } })
    const json = a.toJSON()
    expect(json.action).toBe('callHandler')
    expect(json.handler).toBe('onSave')
    expect(json.arguments).toEqual({ data: 'test' })
  })

  test('RequestDisplayMode serializes', () => {
    const a = new RequestDisplayMode('fullscreen')
    const json = a.toJSON()
    expect(json.action).toBe('requestDisplayMode')
    expect(json.mode).toBe('fullscreen')
  })
})
