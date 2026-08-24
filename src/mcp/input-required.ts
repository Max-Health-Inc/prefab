/**
 * Multi Round-Trip input requests — the 2026-07-28 answer to "ask the user".
 *
 * Before that revision a server pushed `elicitation/create` over a held
 * session. The revision made the protocol core stateless and removed the push
 * channel: a handler now *returns* an `input_required` result carrying the
 * requests, the client answers them and retries the original call, and the
 * handler runs again with the answers in hand.
 *
 * That matters to `display_form()` because a prefab form is a UI, and a UI only
 * exists on a host that renders one. On a host with no MCP Apps surface the
 * form was previously unreachable. The same `AutoFormField[]` now also derives
 * the restricted elicitation schema, so one field list serves both paths:
 *
 *   - a host with a UI gets the prefab form and calls the submit tool, or
 *   - any host gets a native elicitation form and retries the call.
 *
 * The handler is written write-once: read the answers first, request only what
 * is still missing, and return the real result once everything has arrived.
 *
 * @example
 * ```ts
 * import { display, formInputRequest, acceptedFormInput } from '@maxhealth.tech/prefab/mcp'
 *
 * const FIELDS = [
 *   { name: 'email', label: 'Email', type: 'email', required: true },
 *   { name: 'plan', label: 'Plan', options: [{ value: 'pro' }, { value: 'team' }] },
 * ]
 *
 * server.registerTool('signup', schema, async (_args, ctx) => {
 *   const answers = acceptedFormInput(ctx.mcpReq.inputResponses, 'signup', FIELDS)
 *   if (answers == null) return formInputRequest(FIELDS, { key: 'signup', message: 'Create your account' })
 *   return display(autoDetail(await createAccount(answers)))
 * })
 * ```
 */

import type { AutoFormField } from '../auto/form.js'
import { createLogger } from '../core/logger.js'
import type {
  McpElicitFormRequest,
  McpElicitResult,
  McpInputRequiredResult,
  McpInputRequests,
  McpInputResponses,
  McpPrimitiveSchema,
  McpRestrictedSchema,
} from './types.js'

const log = createLogger('mcp')

/** Field `type` values that map onto a wire string format. */
const STRING_FORMAT: Record<string, 'email' | 'uri' | 'date' | 'date-time' | undefined> = {
  email: 'email',
  url: 'uri',
  uri: 'uri',
  date: 'date',
  datetime: 'date-time',
  'datetime-local': 'date-time',
}

/** Field `type` values that are numeric on the wire. */
const NUMERIC: Record<string, 'number' | 'integer' | undefined> = {
  number: 'number',
  range: 'number',
  integer: 'integer',
}

/** Humanize a field name the same way `autoForm` does, for schema titles. */
function humanize(name: string): string {
  return name
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Derive the restricted schema for one field.
 *
 * `password` deliberately produces a plain string. The restricted schema has no
 * secret-input format, so claiming one would be a lie about how the client will
 * render it; the type is dropped rather than misrepresented.
 */
function fieldSchema(field: AutoFormField): McpPrimitiveSchema {
  const title = field.label ?? humanize(field.name)
  const common = { title, ...(field.description != null && { description: field.description }) }

  if (field.options != null && field.options.length > 0) {
    const values = field.options.map(o => o.value)
    if (field.multiple === true) {
      return {
        ...common,
        type: 'array',
        items: { type: 'string', enum: values },
        ...(field.min != null && { minItems: field.min }),
        ...(field.max != null && { maxItems: field.max }),
        ...(Array.isArray(field.default) && { default: field.default }),
      }
    }
    return {
      ...common,
      type: 'string',
      enum: values,
      ...(typeof field.default === 'string' && { default: field.default }),
    }
  }

  const type = field.type ?? 'text'

  const numeric = NUMERIC[type]
  if (numeric != null) {
    return {
      ...common,
      type: numeric,
      ...(field.min != null && { minimum: field.min }),
      ...(field.max != null && { maximum: field.max }),
      ...(typeof field.default === 'number' && { default: field.default }),
    }
  }

  if (type === 'checkbox' || type === 'boolean') {
    return { ...common, type: 'boolean', ...(typeof field.default === 'boolean' && { default: field.default }) }
  }

  const format = STRING_FORMAT[type]
  return {
    ...common,
    type: 'string',
    ...(format != null && { format }),
    ...(field.min != null && { minLength: field.min }),
    ...(field.max != null && { maxLength: field.max }),
    ...(typeof field.default === 'string' && { default: field.default }),
  }
}

/**
 * Derive the restricted elicitation schema from form fields.
 *
 * This is the same field list `autoForm` renders, so the elicitation and the
 * prefab form always ask for the same thing.
 */
export function formSchema(fields: AutoFormField[]): McpRestrictedSchema {
  const properties: Record<string, McpPrimitiveSchema> = {}
  const required: string[] = []

  for (const field of fields) {
    properties[field.name] = fieldSchema(field)
    if (field.required === true) required.push(field.name)
  }

  return { type: 'object', properties, ...(required.length > 0 && { required }) }
}

// ── formInputRequest() ───────────────────────────────────────────────────────

export interface FormInputRequestOptions {
  /**
   * Key the request is filed under, and the key the answer comes back on.
   * @default 'form'
   */
  key?: string
  /** Prompt shown to the user. @default the field list's own title, or a generic ask */
  message?: string
  /** Opaque state echoed back on the retry. Sign it; see the SDK's request-state codec. */
  requestState?: string
}

/**
 * Ask the client to collect these fields, then retry the call.
 *
 * @returns an `input_required` result, ready to return from a tool handler.
 */
export function formInputRequest(
  fields: AutoFormField[],
  options?: FormInputRequestOptions,
): McpInputRequiredResult {
  if (fields.length === 0) {
    throw new TypeError('formInputRequest: at least one field is required, otherwise the client has nothing to ask')
  }

  const key = options?.key ?? 'form'
  const request: McpElicitFormRequest = {
    method: 'elicitation/create',
    params: {
      mode: 'form',
      message: options?.message ?? 'Please provide the following information',
      requestedSchema: formSchema(fields),
    },
  }

  const inputRequests: McpInputRequests = { [key]: request }
  return {
    resultType: 'input_required',
    inputRequests,
    ...(options?.requestState != null && { requestState: options.requestState }),
  }
}

// ── Reading the answer ───────────────────────────────────────────────────────

/** A client's answer for one key, or `undefined` when it has not arrived yet. */
export function inputResponse(
  responses: McpInputResponses | undefined,
  key: string,
): McpElicitResult | undefined {
  return responses?.[key]
}

/** Values a client may return for one field. */
export type FormValue = string | number | boolean | string[]

/**
 * Read and check an accepted form answer.
 *
 * `inputResponses` comes from the client and is untrusted, so the content is
 * checked against the same field list that produced the schema: unknown keys
 * are dropped, wrong types are rejected, and a missing required field fails the
 * whole answer. A declined or cancelled elicitation returns `undefined` exactly
 * like a first entry — re-requesting is only the right move for all three when
 * the request is idempotent, so read {@link inputResponse} directly when a
 * refusal has to be told apart from a first pass.
 */
export function acceptedFormInput(
  responses: McpInputResponses | undefined,
  key: string,
  fields: AutoFormField[],
): Record<string, FormValue> | undefined {
  const response = inputResponse(responses, key)
  if (response?.action !== 'accept' || response.content == null) return undefined

  const byName = new Map(fields.map(f => [f.name, f]))
  const accepted: Record<string, FormValue> = {}

  for (const [name, value] of Object.entries(response.content)) {
    const field = byName.get(name)
    if (field == null) {
      log.warn(`input response "${key}" carried unknown field "${name}"; dropped`)
      continue
    }
    if (!matchesField(field, value)) {
      log.warn(`input response "${key}" field "${name}" did not match its requested schema; dropped`)
      continue
    }
    accepted[name] = value
  }

  for (const field of fields) {
    if (field.required === true && !(field.name in accepted)) return undefined
  }

  return accepted
}

/** Check one returned value against the schema its field produced. */
function matchesField(field: AutoFormField, value: FormValue): boolean {
  const schema = fieldSchema(field)

  switch (schema.type) {
    case 'boolean':
      return typeof value === 'boolean'
    case 'number':
      return typeof value === 'number' && withinBounds(schema.minimum, schema.maximum, value)
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value) && withinBounds(schema.minimum, schema.maximum, value)
    case 'array': {
      if (!Array.isArray(value)) return false
      const allowed = new Set(schema.items.enum)
      return value.every(v => typeof v === 'string' && allowed.has(v))
    }
    default: {
      if (typeof value !== 'string') return false
      if ('enum' in schema) return schema.enum.includes(value)
      if (schema.minLength != null && value.length < schema.minLength) return false
      if (schema.maxLength != null && value.length > schema.maxLength) return false
      return true
    }
  }
}

function withinBounds(min: number | undefined, max: number | undefined, value: number): boolean {
  if (min != null && value < min) return false
  if (max != null && value > max) return false
  return true
}
