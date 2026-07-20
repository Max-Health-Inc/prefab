---
url: /prefab/reference/api/mcp/interfaces/StateUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / StateUpdate

# Interface: StateUpdate

Defined in: [mcp/display.ts:178](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L178)

## Properties

### state

```ts
state: Record<string, unknown>;
```

Defined in: [mcp/display.ts:180](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L180)

State key-value pairs to merge into the existing UI state.

***

### actions?

```ts
optional actions?: 
  | ActionJSON
  | ActionJSON[];
```

Defined in: [mcp/display.ts:182](https://github.com/Max-Health-Inc/prefab/blob/88d9aa00d6a50ef0286767079c6345c808f6a0a9/src/mcp/display.ts#L182)

Actions to fire after the state delta is applied.
