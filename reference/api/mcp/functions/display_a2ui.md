---
url: /prefab/reference/api/mcp/functions/display_a2ui.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / display\_a2ui

# Function: display\_a2ui()

```ts
function display_a2ui(viewOrApp, options?): McpDisplayResult<A2uiMessageList>;
```

Defined in: [mcp/a2ui.ts:93](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/mcp/a2ui.ts#L93)

Return a view as an A2UI tool result.

The messages travel as an `EmbeddedResource` in `content`, which is where a
host looks for a payload it should route to its A2UI renderer, and as
`structuredContent` for hosts that read results structurally.

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
