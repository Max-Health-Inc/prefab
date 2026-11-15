---
url: /prefab/reference/api/renderer/interfaces/ModelContextUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ModelContextUpdate

# Interface: ModelContextUpdate

Defined in: [renderer/actions.ts:37](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/actions.ts#L37)

What the host adds to the model's context for its next turn (MCP Apps `ui/update-model-context`).

## Properties

### content?

```ts
optional content?: object[];
```

Defined in: [renderer/actions.ts:39](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/actions.ts#L39)

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

Defined in: [renderer/actions.ts:41](https://github.com/Max-Health-Inc/prefab/blob/c0cfbec14aa21a1c1e0bc95f1b172db8df096fe0/src/renderer/actions.ts#L41)

Machine-readable data for the host.
