---
url: /prefab/reference/api/renderer/functions/createLogger.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / createLogger

# Function: createLogger()

```ts
function createLogger(scope?): Logger;
```

Defined in: [core/logger.ts:47](https://github.com/Max-Health-Inc/prefab/blob/7a2e43417fa83301b42abd7447c199249e6c40f6/src/core/logger.ts#L47)

Create a scoped logger. Output is prefixed `[prefab]` (no scope) or
`[prefab:<scope>]`, matching prefab's existing console convention.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `scope?` | `string` |

## Returns

[`Logger`](../interfaces/Logger.md)
