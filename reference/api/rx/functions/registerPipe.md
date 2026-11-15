---
url: /prefab/reference/api/rx/functions/registerPipe.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / registerPipe

# Function: registerPipe()

```ts
function registerPipe(name, fn): void;
```

Defined in: [rx/pipes.ts:18](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/rx/pipes.ts#L18)

Register a custom pipe. Re-registering warns and overwrites; a built-in of the same name still wins.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `fn` | [`PipeFn`](../type-aliases/PipeFn.md) |

## Returns

`void`
