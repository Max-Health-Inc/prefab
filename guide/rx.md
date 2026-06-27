---
url: /prefab/guide/rx.md
description: >-
  Reactive template expressions, pipes, signals, and collections — prefab's
  client-side state system with auto-updating UI bindings.
---

# Reactive Expressions (`rx`)

A reactive expression is just a string wrapped in `{{ }}` that the renderer keeps alive. Instead of baking a value into your UI once, you hand the renderer a tiny formula. Whenever the underlying state changes, the renderer re-runs the formula and patches only the affected parts of the screen.

```
Hello, {{ user.name }}!     →     Hello, Ada!
```

Change `user.name` in state and the greeting updates on its own. No re-render call, no event wiring — that is the whole idea.

## The mental model

Think of four moving pieces that flow in one direction:

1. **State store** — a plain key/value bag that lives in the browser (`count`, `user`, `patients`, …).
2. **Expressions** — `{{ }}` formulas that read from that store and from loop or event scope.
3. **Pipes** — `| filters` that format a value for display (`{{ price | currency:'EUR' }}`).
4. **Auto-update** — when state changes, every expression that touched the changed key re-evaluates and the DOM follows.

You rarely write the raw strings by hand. The `rx()` builder gives you a typed, chainable way to compose them, so a typo becomes a compile error instead of a blank screen:

```ts
import { rx, STATE } from '@maxhealth.tech/prefab'

rx('count').add(1)          // → "{{ count + 1 }}"
rx('name').upper()          // → "{{ name | upper }}"
rx('active').then('On', 'Off')
```

Expressions can also reference scope that only exists in certain places — the current `item` and `index` inside a `ForEach` loop, the `event` payload on a form, or the `result` and `error` of a tool call. Each has a matching builder (`ITEM`, `INDEX`, `EVENT`, `RESULT`, `ERROR`).

## Signals & Collections

Raw state keys work, but they are untyped and easy to misspell. **Signals** and **collections** are a thin typed layer on top of the same state store, giving your reactive data a name, a shape, and a home.

* A **signal** is a single reactive scalar — a string, number, boolean, or null. Think "the currently selected id" or "is the panel open".
* A **collection** is a keyed array of rows, with helpers to look a row up by a signal's value.

The nice part: declaring them is enough. Their initial values are auto-collected into `PrefabApp` state, so you never hand-assemble a `state: { ... }` object.

```ts
import { signal, collection } from '@maxhealth.tech/prefab'

const patients = collection('patients', data, { key: 'id' })
const selectedId = signal('selectedPatientId', patients.firstKey())

// patients.by(selectedId) → "{{ patients | find:'id',selectedPatientId }}"
// Reads the selected row, reactively. Bind it straight into a component.
```

Because everything compiles down to `{{ }}` expressions, a signal change ripples through every binding that depends on it — exactly like a hand-written expression, just type-safe.

→ See the [Rx API reference](/reference/api/rx/) for the full API: `rx`, `signal`, `collection`, every scope variable, and the pipe registry.
