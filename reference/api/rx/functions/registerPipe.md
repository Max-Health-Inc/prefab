---
url: /prefab/reference/api/rx/functions/registerPipe.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / registerPipe

# Function: registerPipe()

```ts
function registerPipe(name, fn): void;
```

Defined in: [rx/pipes.ts:18](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/rx/pipes.ts#L18)

Register a custom pipe. Re-registering warns and overwrites; a built-in of the same name still wins.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `fn` | [`PipeFn`](../type-aliases/PipeFn.md) |

## Returns

`void`
