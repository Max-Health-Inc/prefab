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

Defined in: [mcp/a2ui.ts:144](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/a2ui.ts#L144)

Register a static A2UI surface as an `a2ui://` resource.

Static is the point: a surface that does not depend on the conversation is
cheaper as a resource than as a tool, because the host can read it once and
cache it. Anything that varies per call belongs in [display\_a2ui](display_a2ui.md).

`builder` runs on every read rather than once at registration, so a surface
that closes over data refreshes without re-registering.

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
