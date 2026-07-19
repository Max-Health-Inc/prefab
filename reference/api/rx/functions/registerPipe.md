---
url: /prefab/reference/api/rx/functions/registerPipe.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / registerPipe

# Function: registerPipe()

```ts
function registerPipe(name, fn): void;
```

Defined in: [rx/pipes.ts:19](https://github.com/Max-Health-Inc/prefab/blob/c512f3bb2fb808f4335797b98c7b93774e2b1b30/src/rx/pipes.ts#L19)

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
