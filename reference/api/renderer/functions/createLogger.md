---
url: /prefab/reference/api/renderer/functions/createLogger.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / createLogger

# Function: createLogger()

```ts
function createLogger(scope?): Logger;
```

Defined in: [core/logger.ts:47](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/core/logger.ts#L47)

Create a scoped logger. Output is prefixed `[prefab]` (no scope) or
`[prefab:<scope>]`, matching prefab's existing console convention.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `scope?` | `string` |

## Returns

[`Logger`](../interfaces/Logger.md)
