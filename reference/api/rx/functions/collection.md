---
url: /prefab/reference/api/rx/functions/collection.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / collection

# Function: collection()

```ts
function collection<T>(
   stateKey, 
   rows, 
options): Collection<T>;
```

Defined in: [rx/collection.ts:150](https://github.com/Max-Health-Inc/prefab/blob/de93a446678c2f2b8a07006b7acfdb8a5f593717/src/rx/collection.ts#L150)

Create a named keyed collection.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`<`string`, `unknown`> |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `stateKey` | `string` | Stable state path (e.g. 'patients') |
| `rows` | `T`\[] | Source array |
| `options` | { `key`: `string`; } | Must include `key` — the field name used for identity lookup |
| `options.key` | `string` | - |

## Returns

[`Collection`](../classes/Collection.md)<`T`>
