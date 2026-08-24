---
url: /prefab/guide/input-required.md
description: >-
  Ask the user for input under MCP 2026-07-28 — display_form with elicit,
  formInputRequest, and reading the answer with acceptedFormInput.
---

# Asking for input

Protocol revision 2026-07-28 made the MCP core stateless and removed
server-initiated `elicitation/create` pushes. A handler now asks for input by
**returning** an `input_required` result: the client collects the answers and
retries the original call, and the handler runs again with the answers in hand.

That matters to `display_form()`. A prefab form is a UI, and a UI only exists on
a host that renders one. On a host with no MCP Apps surface the form was
unreachable. The same `AutoFormField[]` now also derives the restricted
elicitation schema, so one field list serves both paths.

## The two paths

```ts
const fields = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'plan', label: 'Plan', options: [{ value: 'pro', label: 'Pro' }, { value: 'team' }] },
]

// A host that renders UI: a prefab form calling the `signup` tool on submit.
display_form(fields, 'signup', { title: 'Create your account' })

// Any host: an input_required result the client fills in natively.
display_form(fields, 'signup', { title: 'Create your account', elicit: true })
```

Both ask for exactly the same thing, because both are derived from `fields`.

## The write-once handler

Write one handler that runs on every round: read the answers first, request only
what is still missing, and return the real result once everything has arrived.

```ts
const FIELDS = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'plan', label: 'Plan', options: [{ value: 'pro' }, { value: 'team' }] },
]

async function signup(_args: unknown, ctx: { inputResponses?: McpInputResponses }) {
  const answers = acceptedFormInput(ctx.inputResponses, 'signup', FIELDS)
  if (answers == null) {
    return formInputRequest(FIELDS, { key: 'signup', message: 'Create your account' })
  }
  return display(autoDetail(await createAccount(answers)))
}
```

Round one finds no answers and returns the request. The client shows its form
and retries. Round two finds the answers and the handler finishes.

## Reading the answer

`inputResponses` comes from the client, so treat it as untrusted.
`acceptedFormInput` checks it against the same field list that produced the
schema: unknown keys are dropped, values of the wrong type or outside the
advertised bounds are dropped, an enum value that was never offered is dropped,
and a missing required field fails the whole answer.

```ts
const answers = acceptedFormInput(responses, 'signup', FIELDS)
```

It returns `undefined` for a missing, declined, or cancelled answer alike.
Re-requesting is the right move for all three only when the request is
idempotent. When a refusal has to be told apart from a first pass, read the
response directly:

```ts
const view = inputResponse(responses, 'signup')
if (view?.action === 'decline') {
  // The user said no. Asking again is not the answer.
}
```

## The schema

`formSchema(fields)` produces the restricted JSON Schema on its own, which is
useful when the elicitation is issued through the SDK rather than through
prefab:

```ts
const schema = formSchema([
  { name: 'email', type: 'email', required: true },
  { name: 'age', type: 'number', min: 18, max: 120 },
  { name: 'tags', options: [{ value: 'a' }, { value: 'b' }], multiple: true },
])
```

The wire accepts a flat object of primitives and nothing else, so the mapping is
deliberately narrow:

| Field | Schema |
|---|---|
| `type: 'email' \| 'url' \| 'date' \| 'datetime'` | `string` with the matching `format` |
| `type: 'number' \| 'integer' \| 'range'` | `number` / `integer`, `min`/`max` as bounds |
| `type: 'checkbox' \| 'boolean'` | `boolean` |
| `options` | `string` with `enum` |
| `options` + `multiple` | `array` of `string` with `enum` items |
| anything else | `string`, `min`/`max` as length bounds |

`required: true` puts the field in the schema's `required` list. `label` becomes
the `title`, `description` becomes the `description`, and `default` is carried
across when its type matches.

A `password` field produces a plain string. The restricted schema has no
secret-input format, and claiming one would misrepresent how the client is going
to render it.

## Nesting and richer shapes

The restricted subset has no nested objects and no arrays beyond multi-select
enums. A flow that genuinely needs a richer shape belongs on the UI path, where
prefab renders the whole form and submits it through `CallTool`, or in several
rounds carrying `requestState` between them:

```ts
formInputRequest(FIELDS, { key: 'signup', requestState: signedToken })
```

`requestState` round-trips through the client and comes back as
attacker-controlled input. Sign it — the MCP TypeScript SDK's
`createRequestStateCodec` gives you an HMAC `{ mint, verify }` pair — and mint
only what earlier rounds already proved.
