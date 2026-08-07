---
url: /prefab/reference/api/mcp/interfaces/StateUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / StateUpdate

# Interface: StateUpdate

Defined in: [mcp/display.ts:171](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L171)

## Properties

### state

```ts
state: Record<string, unknown>;
```

Defined in: [mcp/display.ts:173](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L173)

State key-value pairs to merge into the existing UI state.

***

### actions?

```ts
optional actions?: 
  | ActionJSON
  | ActionJSON[];
```

Defined in: [mcp/display.ts:175](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/mcp/display.ts#L175)

Actions to fire after the state delta is applied.
