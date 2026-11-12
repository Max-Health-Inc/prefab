---
url: /prefab/reference/api/renderer/type-aliases/LogLevel.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / LogLevel

# Type Alias: LogLevel

```ts
type LogLevel = "silent" | "error" | "warn" | "info" | "debug";
```

Defined in: [core/logger.ts:10](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/core/logger.ts#L10)

The one sink for prefab's console output, with a runtime level a host can raise or mute:

```ts
import { setLogLevel } from '@maxhealth.tech/prefab'
setLogLevel('silent') // quiet inside a production MCP Apps host
```
