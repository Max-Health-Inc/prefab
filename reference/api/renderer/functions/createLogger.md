---
url: /prefab/reference/api/renderer/functions/createLogger.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / createLogger

# Function: createLogger()

```ts
function createLogger(scope?): Logger;
```

Defined in: [core/logger.ts:39](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/core/logger.ts#L39)

Create a scoped logger. Output is prefixed `[prefab]` (no scope) or
`[prefab:<scope>]`, matching prefab's existing console convention.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `scope?` | `string` |

## Returns

[`Logger`](../interfaces/Logger.md)
