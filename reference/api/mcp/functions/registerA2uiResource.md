---
url: /prefab/reference/api/mcp/functions/registerA2uiResource.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / registerA2uiResource

# Function: registerA2uiResource()

```ts
function registerA2uiResource(
   server, 
   builder, 
   options?): void;
```

Defined in: [mcp/a2ui.ts:110](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/a2ui.ts#L110)

Register an A2UI surface that does not depend on the conversation as an `a2ui://` resource; `builder` runs on every read.
Per-call views belong in [display\_a2ui](display_a2ui.md).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `server` | [`McpServerLike`](../interfaces/McpServerLike.md) |
| `builder` | () => `Component` | `PrefabApp` |
| `options?` | [`A2uiResourceOptions`](../interfaces/A2uiResourceOptions.md) |

## Returns

`void`

## Example

```ts
import { registerA2uiResource } from '@maxhealth.tech/prefab/mcp'
import { Column, H1, Input } from '@maxhealth.tech/prefab'

registerA2uiResource(server, () => Column({ children: [H1('Settings'), Input({ name: 'key', label: 'API key' })] }))
```
