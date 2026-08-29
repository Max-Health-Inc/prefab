---
url: /prefab/reference/api/mcp/variables/displayA2ui.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayA2ui

# Variable: displayA2ui

```ts
const displayA2ui: (viewOrApp, options?) => McpDisplayResult<A2uiMessageList> = display_a2ui;
```

Defined in: [mcp/a2ui.ts:190](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/mcp/a2ui.ts#L190)

camelCase alias, matching the other display helpers.

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
