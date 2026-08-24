---
url: /prefab/reference/api/renderer/functions/validateWireFormat.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / validateWireFormat

# Function: validateWireFormat()

```ts
function validateWireFormat(data, opts?): ValidationResult;
```

Defined in: [core/validate.ts:39](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/core/validate.ts#L39)

Validate a wire format payload. Returns `{ valid: true, errors: [] }` if OK,
or `{ valid: false, errors: [...] }` with details about what's wrong.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `unknown` | The raw parsed JSON to validate |
| `opts` | { `strict?`: `boolean`; } | Optional: `strict` mode warns on unknown component types |
| `opts.strict?` | `boolean` | - |

## Returns

`ValidationResult`
