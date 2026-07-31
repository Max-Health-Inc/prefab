---
url: /prefab/reference/api/actions/classes/CallTool.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / CallTool

# Class: CallTool

Defined in: [actions/mcp.ts:22](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/actions/mcp.ts#L22)

Invoke an MCP tool from the UI.
Used in Form.onSubmit or Button.onClick to call backend tools.

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new CallTool(tool, opts?): CallTool;
```

Defined in: [actions/mcp.ts:23](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/actions/mcp.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tool` | `string` |
| `opts?` | [`CallToolOpts`](../interfaces/CallToolOpts.md) |

#### Returns

`CallTool`

## Properties

### tool

```ts
readonly tool: string;
```

Defined in: [actions/mcp.ts:24](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/actions/mcp.ts#L24)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/mcp.ts:28](https://github.com/Max-Health-Inc/prefab/blob/a35624be6562c3c7b129e80c58368ed6939e09e3/src/actions/mcp.ts#L28)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
