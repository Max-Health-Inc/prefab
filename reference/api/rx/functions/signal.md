---
url: /prefab/reference/api/rx/functions/signal.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / signal

# Function: signal()

```ts
function signal<T>(
   key, 
   initial, 
options?): Signal<T>;
```

Defined in: [rx/signal.ts:72](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/rx/signal.ts#L72)

Create a named reactive signal.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`SignalValue`](../type-aliases/SignalValue.md) |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Stable state path (e.g. 'selectedPatientId') |
| `initial` | `T` | Initial value |
| `options?` | [`SignalOptions`](../interfaces/SignalOptions.md) | Optional configuration (urlSync, etc.) |

## Returns

[`Signal`](../classes/Signal.md)<`T`>
