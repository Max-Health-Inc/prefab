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

Defined in: [rx/signal.ts:62](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/rx/signal.ts#L62)

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
