---
url: /prefab/reference/api/mcp/interfaces/StateUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / StateUpdate

# Interface: StateUpdate

Defined in: [mcp/display.ts:209](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/display.ts#L209)

## Properties

### state

```ts
state: Record<string, unknown>;
```

Defined in: [mcp/display.ts:211](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/display.ts#L211)

State key-value pairs to merge into the existing UI state.

***

### actions?

```ts
optional actions?: 
  | ActionJSON
  | ActionJSON[];
```

Defined in: [mcp/display.ts:213](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/display.ts#L213)

Actions to fire after the state delta is applied.
