---
url: /prefab/reference/api/renderer/type-aliases/LogLevel.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / LogLevel

# Type Alias: LogLevel

```ts
type LogLevel = "silent" | "error" | "warn" | "info" | "debug";
```

Defined in: [core/logger.ts:18](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/core/logger.ts#L18)

Centralized logger — the single sink for all prefab console output.

Zero-dependency by design (prefab's renderer bundle ships no runtime deps),
but API-compatible with the org-wide `@maxhealth.tech/utils` `createLogger`
so call sites read the same everywhere and could later swap to the shared
package without churn.

Adds a runtime level (the utils logger gates on NODE\_ENV, which is unreliable
in a browser bundle) so an embedding host can raise or mute prefab's output:

```ts
import { setLogLevel } from '@maxhealth.tech/prefab'
setLogLevel('silent') // quiet inside a production MCP Apps host
```
