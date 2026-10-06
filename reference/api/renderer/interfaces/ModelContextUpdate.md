---
url: /prefab/reference/api/renderer/interfaces/ModelContextUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ModelContextUpdate

# Interface: ModelContextUpdate

Defined in: [renderer/actions.ts:40](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L40)

What the host adds to the model's context for its next turn (MCP Apps `ui/update-model-context`).

## Properties

### content?

```ts
optional content?: object[];
```

Defined in: [renderer/actions.ts:42](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L42)

Text the model reads.

#### type

```ts
type: "text";
```

#### text

```ts
text: string;
```

***

### structuredContent?

```ts
optional structuredContent?: Record<string, unknown>;
```

Defined in: [renderer/actions.ts:44](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/renderer/actions.ts#L44)

Machine-readable data for the host.
