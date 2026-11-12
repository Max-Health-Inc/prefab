---
url: /prefab/reference/api/renderer/functions/validateWireFormat.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / validateWireFormat

# Function: validateWireFormat()

```ts
function validateWireFormat(data, opts?): ValidationResult;
```

Defined in: [core/validate.ts:40](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/core/validate.ts#L40)

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
