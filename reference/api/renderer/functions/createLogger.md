---
url: /prefab/reference/api/renderer/functions/createLogger.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / createLogger

# Function: createLogger()

```ts
function createLogger(scope?): Logger;
```

Defined in: [core/logger.ts:47](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/core/logger.ts#L47)

Create a scoped logger. Output is prefixed `[prefab]` (no scope) or
`[prefab:<scope>]`, matching prefab's existing console convention.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `scope?` | `string` |

## Returns

[`Logger`](../interfaces/Logger.md)
