/**
 * fieldsFromJsonSchema — derive form fields from a JSON Schema.
 *
 * `formSchema()` in `src/mcp/input-required.ts` turns an `AutoFormField[]` into
 * an elicitation schema. This is the other direction, and it is the one a server
 * usually needs: every MCP tool already declares an `inputSchema`, every REST
 * route already declares a request body, and both are JSON Schema. Handing that
 * schema here produces the field list `autoForm()` renders, so a tool's own
 * input contract draws its own form with no second description of the fields.
 *
 * Only what a flat form can honestly ask for is emitted. A nested object, an
 * array of objects, or a branch with no primitive type is skipped rather than
 * rendered as a control that cannot round-trip — the same rule `autoTable`
 * applies to nested columns.
 *
 * @example
 * ```ts
 * import { autoForm, fieldsFromJsonSchema } from '@maxhealth.tech/prefab'
 *
 * const fields = fieldsFromJsonSchema({
 *   type: 'object',
 *   required: ['email'],
 *   properties: {
 *     email: { type: 'string', format: 'email', title: 'Email' },
 *     plan: { type: 'string', enum: ['pro', 'team'] },
 *     seats: { type: 'integer', minimum: 1, maximum: 50 },
 *   },
 * })
 *
 * autoForm(fields, 'create_account', { title: 'New account' })
 * ```
 */

import type { AutoFormField, AutoFormOption } from './form.js'

// ── Schema shape ─────────────────────────────────────────────────────────────

/**
 * The JSON Schema keywords a form field can express, read structurally.
 *
 * Deliberately not a full JSON Schema type: this reads schemas from anywhere
 * (TypeBox, Zod, a hand-written spec, an OpenAPI document) and only the
 * keywords below survive the crossing into a control.
 */
export interface JsonSchemaNode {
  type?: string | string[]
  format?: string
  title?: string
  description?: string
  enum?: unknown[]
  const?: unknown
  default?: unknown
  properties?: Record<string, JsonSchemaNode>
  required?: string[]
  items?: JsonSchemaNode
  anyOf?: JsonSchemaNode[]
  oneOf?: JsonSchemaNode[]
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  minItems?: number
  maxItems?: number
  readOnly?: boolean
}

export interface FieldsFromJsonSchemaOptions {
  /** Property names to leave out (server-managed keys, path params already known). */
  exclude?: string[]
  /**
   * Property names to keep, in this order. Anything else is dropped, and a name
   * the schema does not declare is ignored rather than invented.
   */
  include?: string[]
  /**
   * Emit a field for every property, including ones already marked
   * `readOnly: true` in the schema. @default false
   */
  includeReadOnly?: boolean
}

// ── Type mapping ─────────────────────────────────────────────────────────────

/**
 * JSON Schema `format` → the field `type` that renders it.
 *
 * These land on `<input type>` verbatim, so every value here is a real HTML
 * input type; `date-time` becomes `datetime-local` because that is the control
 * a browser has. `password` is not a JSON Schema format, but TypeBox and
 * OpenAPI both emit it and a password field is worth honouring.
 */
const FORMAT_TYPE: Record<string, string> = {
  email: 'email',
  uri: 'url',
  url: 'url',
  'uri-reference': 'url',
  hostname: 'url',
  date: 'date',
  'date-time': 'datetime-local',
  time: 'time',
  password: 'password',
  tel: 'tel',
  phone: 'tel',
}

/**
 * Read an untyped value as a schema node, or nothing when it is not one.
 * Schemas arrive from callers as `unknown`, and every recursive read (a
 * property, `items`, a union branch) has to survive whatever is actually there.
 */
function asNode(value: unknown): JsonSchemaNode | undefined {
  return value != null && typeof value === 'object' && !Array.isArray(value) ? value : undefined
}

/** The `properties` map, read the same defensive way. */
function asRecord(value: unknown): Record<string, unknown> | undefined {
  const node = asNode(value)
  return node as Record<string, unknown> | undefined
}

/** Types a flat form can ask for. Everything else is structure, not a value. */
const PRIMITIVE_TYPES = new Set(['string', 'number', 'integer', 'boolean'])

/**
 * Resolve the branch of a union that a single control should represent.
 *
 * Two unions are worth resolving rather than skipping. A nullable field
 * (`type: ['string','null']`, or an `anyOf` with a null branch) is one optional
 * control. And a coercion union — Elysia compiles `t.Integer()` to
 * `anyOf: [{ type: 'string', format: 'integer' }, { type: 'integer' }]` so a
 * query string can carry a number — describes one number field written twice;
 * the non-string branch is the one that says what the value means.
 *
 * A branch carrying an `enum` wins over both: it is the most specific thing
 * said about the value, and it renders as a Select.
 */
function resolveNode(node: JsonSchemaNode): JsonSchemaNode | undefined {
  const union = node.anyOf ?? node.oneOf
  if (union == null || union.length === 0) {
    if (Array.isArray(node.type)) {
      const type = node.type.find(t => t !== 'null')
      return type == null ? undefined : { ...node, type }
    }
    return node
  }

  const branches = union
    .map(resolveNode)
    .filter((b): b is JsonSchemaNode => b != null && b.type !== 'null')
  if (branches.length === 0) return undefined

  const enumBranch = branches.find(b => b.enum != null || b.items?.enum != null)
  const typedBranch = branches.find(b => b.type != null && b.type !== 'string')
  const resolved = enumBranch ?? typedBranch ?? branches[0]

  // Keep the annotations from the union itself: a coercion union carries its
  // title and description on the parent, not on the branch that won.
  return {
    ...resolved,
    ...(node.title != null && resolved.title == null && { title: node.title }),
    ...(node.description != null && resolved.description == null && { description: node.description }),
    ...(node.default !== undefined && resolved.default === undefined && { default: node.default }),
  }
}

/** Enum values as form options. Non-string values are stringified, as a control submits text. */
function toOptions(values: unknown[]): AutoFormOption[] {
  return values
    .filter(v => v !== null && typeof v !== 'object')
    .map(v => ({ value: String(v) }))
}

/** A default is only carried across when the control can actually hold it. */
function toDefault(value: unknown): AutoFormField['default'] | undefined {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value) && value.every(v => typeof v === 'string')) return value
  return undefined
}

/**
 * Build one field, or undefined when the property is not a value a flat form
 * can ask for (a nested object, an array of objects, an empty union).
 */
function toField(name: string, raw: JsonSchemaNode, required: boolean): AutoFormField | undefined {
  const node = resolveNode(raw)
  if (node == null) return undefined

  const common = {
    name,
    ...(node.title != null && { label: node.title }),
    ...(node.description != null && { description: node.description }),
    ...(required && { required: true }),
  }

  // A `const` is an enum of one — the schema saying the value is fixed.
  const enumValues = node.enum ?? (node.const !== undefined ? [node.const] : undefined)
  if (enumValues != null) {
    const options = toOptions(enumValues)
    if (options.length === 0) return undefined
    const fallback = toDefault(node.default)
    return {
      ...common,
      options,
      ...(typeof fallback === 'string' && { default: fallback }),
    }
  }

  if (node.type === 'array') {
    // Only a multi-choice list survives: an array of free-form values has no
    // single control, and an array of objects is a table, not a field.
    const items = node.items == null ? undefined : resolveNode(node.items)
    if (items?.enum == null) return undefined
    const options = toOptions(items.enum)
    if (options.length === 0) return undefined
    const fallback = toDefault(node.default)
    return {
      ...common,
      options,
      multiple: true,
      ...(node.minItems != null && { min: node.minItems }),
      ...(node.maxItems != null && { max: node.maxItems }),
      ...(Array.isArray(fallback) && { default: fallback }),
    }
  }

  if (typeof node.type !== 'string' || !PRIMITIVE_TYPES.has(node.type)) return undefined

  const fallback = toDefault(node.default)

  if (node.type === 'boolean') {
    return { ...common, type: 'checkbox', ...(typeof fallback === 'boolean' && { default: fallback }) }
  }

  if (node.type === 'number' || node.type === 'integer') {
    // Both render as `type="number"`: `integer` is not an input type, and a
    // control claiming one falls back to free text in every browser.
    return {
      ...common,
      type: 'number',
      ...(node.minimum != null && { min: node.minimum }),
      ...(node.maximum != null && { max: node.maximum }),
      ...(typeof fallback === 'number' && { default: fallback }),
    }
  }

  const type = node.format != null ? FORMAT_TYPE[node.format] : undefined
  return {
    ...common,
    type: type ?? 'text',
    ...(node.minLength != null && { min: node.minLength }),
    ...(node.maxLength != null && { max: node.maxLength }),
    ...(typeof fallback === 'string' && { default: fallback }),
  }
}

// ── fieldsFromJsonSchema() ───────────────────────────────────────────────────

/**
 * Derive `autoForm` fields from a JSON Schema object.
 *
 * Returns an empty list for anything that is not an object schema with
 * properties, so a caller can hand over whatever a route declared and branch on
 * the result rather than pre-checking the shape.
 */
export function fieldsFromJsonSchema(
  schema: unknown,
  options?: FieldsFromJsonSchemaOptions,
): AutoFormField[] {
  const root = asNode(schema)
  const resolved = root == null ? undefined : resolveNode(root)
  const properties = asRecord(resolved?.properties)
  if (properties == null) return []

  const required = new Set(Array.isArray(resolved?.required) ? resolved.required : [])
  const exclude = new Set(options?.exclude ?? [])
  const names = options?.include ?? Object.keys(properties)

  const fields: AutoFormField[] = []
  for (const name of names) {
    const property = asNode(properties[name])
    if (property == null) continue
    if (exclude.has(name)) continue
    if (property.readOnly === true && options?.includeReadOnly !== true) continue

    const field = toField(name, property, required.has(name))
    if (field != null) fields.push(field)
  }
  return fields
}
