---
url: /prefab/reference/api/rx/functions/registerPipe.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / registerPipe

# Function: registerPipe()

```ts
function registerPipe(name, fn): void;
```

Defined in: [rx/pipes.ts:30](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/rx/pipes.ts#L30)

Register a custom pipe filter.
Re-registration warns and overwrites (HMR-friendly).
Built-in pipes in applyFilter always shadow custom pipes.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `fn` | [`PipeFn`](../type-aliases/PipeFn.md) |

## Returns

`void`
