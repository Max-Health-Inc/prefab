---
url: /prefab/reference/api/rx.md
---
[@maxhealth.tech/prefab](../index.md) / rx

# rx

## Classes

| Class | Description |
| ------ | ------ |
| [Ref](classes/Ref.md) | A lazy, serializable reference to a row in a collection. The expression is evaluated at runtime by the renderer's pipe evaluator. |
| [Collection](classes/Collection.md) | A named keyed array. Serializes rows into state and provides typed lookup helpers that compile to pipe expressions. |
| [Rx](classes/Rx.md) | Rx — Reactive expression builder. |
| [Signal](classes/Signal.md) | A named reactive scalar. Carries a state key, an initial value, and produces rx expressions for component props. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [SignalOptions](interfaces/SignalOptions.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [PipeFn](type-aliases/PipeFn.md) | A pipe function receives the current value and optional arguments. |
| [SignalValue](type-aliases/SignalValue.md) | Allowed signal value types — intentionally excludes objects/arrays. |

## Variables

| Variable | Description |
| ------ | ------ |
| [ITEM](variables/ITEM.md) | Current item in a ForEach loop |
| [INDEX](variables/INDEX.md) | Current index in a ForEach loop |
| [EVENT](variables/EVENT.md) | Value from an interaction event (input value, checkbox state, etc.) |
| [ERROR](variables/ERROR.md) | Error message available in on\_error callbacks |
| [RESULT](variables/RESULT.md) | Return value available in on\_success callbacks |
| [STATE](variables/STATE.md) | STATE proxy — convenience for accessing state keys. Usage: STATE.foo → rx('foo'), STATE.user.name → rx('user.name') |

## Functions

| Function | Description |
| ------ | ------ |
| [collection](functions/collection.md) | Create a named keyed collection. |
| [registerPipe](functions/registerPipe.md) | Register a custom pipe filter. Re-registration warns and overwrites (HMR-friendly). Built-in pipes in applyFilter always shadow custom pipes. |
| [unregisterPipe](functions/unregisterPipe.md) | Remove a custom pipe (useful in tests). Returns true if it existed. |
| [listPipes](functions/listPipes.md) | List all registered custom pipe names (useful for debugging). |
| [rx](functions/rx.md) | Create an Rx expression referencing a state key |
| [signal](functions/signal.md) | Create a named reactive signal. |
