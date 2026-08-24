/**
 * Table mappers — the one place a prefab component gains structure on the way
 * out rather than losing it.
 *
 * The A2UI Basic catalog has no table component, so a table becomes a `Column`
 * of `Row`s. For `DataTable` that would be a poor trade, because prefab's table
 * is data-driven and flattening it would inline every row as its own component
 * and lose the binding. A2UI's own answer is the child template: a `Column`
 * whose `children` is `{ path, componentId }` instantiates one copy of the
 * template component per item in a data-model list, and paths inside the
 * template resolve relative to the current item. That maps onto `DataTable`
 * exactly — one `Row` template, one `Text` per column bound to the column key —
 * so the emitted surface stays as small and as reactive as the prefab original.
 *
 * The pattern follows `catalogs/basic/examples/18_track-list.json` in the A2UI
 * specification, which is the normative example for templated lists.
 */

import type { ComponentJSON } from '../core/component.js'
import type { A2uiProps, EmitContext } from './catalog.js'
import { dynamicString, toBinding } from './expr.js'

/** prefab table parts that only exist inside a `Table` and never map on their own. */
export const TABLE_PART_TYPES = [
  'TableHead', 'TableBody', 'TableFooter', 'TableRow', 'TableCell', 'TableHeader', 'ExpandableRow',
] as const

interface ColumnDef {
  key: string
  header: string
}

/** Read a `DataTable`'s serialized column definitions defensively. */
function columnDefs(node: ComponentJSON): ColumnDef[] {
  if (!Array.isArray(node.columns)) return []
  const defs: ColumnDef[] = []
  for (const raw of node.columns) {
    if (raw == null || typeof raw !== 'object') continue
    const col = raw as Record<string, unknown>
    const key = typeof col.accessor === 'string' ? col.accessor : typeof col.key === 'string' ? col.key : undefined
    if (key == null) continue
    defs.push({ key, header: typeof col.header === 'string' ? col.header : key })
  }
  return defs
}

/**
 * Resolve where the row list lives in the data model.
 *
 * `rows` is either a `{{ }}` expression already pointing at surface state, or a
 * literal array, which is seeded into the data model under a generated key so
 * the template has something to iterate.
 */
function rowsPointer(node: ComponentJSON, ctx: EmitContext): string | undefined {
  const rows = node.rows
  if (typeof rows === 'string') {
    const bound = toBinding(rows)
    if (bound.kind === 'binding') return bound.value.path
    ctx.note('expression', 'DataTable', `rows expression "${rows}" is not a plain path; the table has no data source`)
    return undefined
  }
  if (Array.isArray(rows)) return ctx.bindData('rows', rows)
  ctx.note('unsupported', 'DataTable', 'no rows to render')
  return undefined
}

/**
 * `DataTable` → a header `Row` plus a templated `Column`.
 *
 * A column key containing a `.` addresses a nested field on the row. Relative
 * paths inside a template are JSON Pointers too, so the dots become slashes.
 */
export function mapDataTable(node: ComponentJSON, ctx: EmitContext): A2uiProps | undefined {
  const columns = columnDefs(node)
  if (columns.length === 0) {
    ctx.note('unsupported', 'DataTable', 'no usable column definitions')
    return undefined
  }

  const path = rowsPointer(node, ctx)
  if (path == null) return undefined

  const headerRow = ctx.push({
    component: 'Row',
    children: columns.map(c => ctx.push({ component: 'Text', text: c.header, variant: 'caption' })),
    align: 'center',
  })

  const template = ctx.push({
    component: 'Row',
    children: columns.map(c => ctx.push({
      component: 'Text',
      // Relative pointer: no leading slash, so it resolves against the current row.
      text: { path: c.key.split('.').join('/') },
    })),
    align: 'center',
  })

  // A2UI's templated-children form: one instance of `template` per item at `path`.
  const list = ctx.push({ component: 'Column', children: { path, componentId: template } })

  if (node.search === true || node.paginated === true) {
    ctx.note('degraded', 'DataTable', 'search and pagination dropped; A2UI Basic has no table controls')
  }

  return { component: 'Column', children: [headerRow, list] }
}

// ── Static Table ─────────────────────────────────────────────────────────────

/** Collect the `TableRow` nodes nested under a `Table`'s section wrappers. */
function tableRows(node: ComponentJSON): ComponentJSON[] {
  const rows: ComponentJSON[] = []
  const visit = (n: ComponentJSON): void => {
    if (n.type === 'TableRow' || n.type === 'ExpandableRow') {
      rows.push(n)
      return
    }
    if (Array.isArray(n.children)) for (const c of n.children) visit(c)
  }
  if (Array.isArray(node.children)) for (const c of node.children) visit(c)
  return rows
}

/**
 * Emit one table cell.
 *
 * A cell holding components delegates to them; a cell holding only text becomes
 * a `Text`, with header cells marked as captions so the header row still reads
 * as a header after the table structure is gone.
 */
function cell(node: ComponentJSON, ctx: EmitContext): string | undefined {
  const isHeader = node.type === 'TableHeader'
  if (Array.isArray(node.children) && node.children.length > 0) {
    return ctx.single(node.children)
  }
  const raw = node.content ?? node.text ?? node.label
  if (typeof raw !== 'string' && typeof raw !== 'number' && typeof raw !== 'boolean') return undefined
  const content = String(raw)
  const text = dynamicString(content)
  if (text == null) {
    ctx.note('expression', node.type, `cell expression "${content}" has no A2UI equivalent`)
    return undefined
  }
  return ctx.push({ component: 'Text', text, ...(isHeader && { variant: 'caption' }) })
}

/** `Table` → a `Column` of `Row`s, one per `TableRow`. */
export function mapTable(node: ComponentJSON, ctx: EmitContext): A2uiProps | undefined {
  const rows = tableRows(node)
  const emitted: string[] = []

  for (const row of rows) {
    const cells = Array.isArray(row.children) ? row.children : []
    const ids = cells.map(c => cell(c, ctx)).filter((id): id is string => id != null)
    if (ids.length === 0) continue
    emitted.push(ctx.push({ component: 'Row', children: ids, align: 'center' }))
  }

  if (emitted.length === 0) {
    ctx.note('unsupported', 'Table', 'no rows with renderable cells')
    return undefined
  }

  ctx.note('degraded', 'Table', 'rendered as a Column of Rows; column widths do not align')
  return { component: 'Column', children: emitted }
}
