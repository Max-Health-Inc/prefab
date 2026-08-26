---
url: /prefab/reference/api/actions/classes/UpdateContext.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / UpdateContext

# Class: UpdateContext

Defined in: [actions/mcp.ts:50](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/actions/mcp.ts#L50)

Base interface all actions implement

## Implements

* [`Action`](../interfaces/Action.md)

## Constructors

### Constructor

```ts
new UpdateContext(context): UpdateContext;
```

Defined in: [actions/mcp.ts:51](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/actions/mcp.ts#L51)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `context` | `Record`<`string`, `unknown`> |

#### Returns

`UpdateContext`

## Properties

### context

```ts
readonly context: Record<string, unknown>;
```

Defined in: [actions/mcp.ts:51](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/actions/mcp.ts#L51)

## Methods

### toJSON()

```ts
toJSON(): ActionJSON;
```

Defined in: [actions/mcp.ts:53](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/actions/mcp.ts#L53)

#### Returns

[`ActionJSON`](../interfaces/ActionJSON.md)

#### Implementation of

[`Action`](../interfaces/Action.md).[`toJSON`](../interfaces/Action.md#tojson)
