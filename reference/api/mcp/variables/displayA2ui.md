---
url: /prefab/reference/api/mcp/variables/displayA2ui.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / displayA2ui

# Variable: displayA2ui

```ts
const displayA2ui: (viewOrApp, options?) => McpDisplayResult<A2uiMessageList> = display_a2ui;
```

Defined in: [mcp/a2ui.ts:156](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/a2ui.ts#L156)

camelCase alias, matching the other display helpers.

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
