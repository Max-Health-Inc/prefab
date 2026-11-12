---
url: /prefab/reference/api/mcp/functions/display_a2ui.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_a2ui

# Function: display\_a2ui()

```ts
function display_a2ui(viewOrApp, options?): McpDisplayResult<A2uiMessageList>;
```

Defined in: [mcp/a2ui.ts:65](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/a2ui.ts#L65)

A view as an A2UI tool result: an `EmbeddedResource` in `content`, and the same payload as `structuredContent`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `viewOrApp` | `Component` | `PrefabApp` |
| `options?` | [`DisplayA2uiOptions`](../interfaces/DisplayA2uiOptions.md) |

## Returns

[`McpDisplayResult`](../type-aliases/McpDisplayResult.md)<`A2uiMessageList`>

## Example

```ts
import { display_a2ui } from '@maxhealth.tech/prefab/mcp'
import { autoTable } from '@maxhealth.tech/prefab'

server.registerTool('list-users', schema, async () =>
  display_a2ui(autoTable(await db.users())))
```
