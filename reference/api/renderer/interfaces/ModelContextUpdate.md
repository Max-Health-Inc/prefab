---
url: /prefab/reference/api/renderer/interfaces/ModelContextUpdate.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ModelContextUpdate

# Interface: ModelContextUpdate

Defined in: [renderer/actions.ts:37](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/renderer/actions.ts#L37)

What the host adds to the model's context for its next turn (MCP Apps `ui/update-model-context`).

## Properties

### content?

```ts
optional content?: object[];
```

Defined in: [renderer/actions.ts:39](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/renderer/actions.ts#L39)

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

Defined in: [renderer/actions.ts:41](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/renderer/actions.ts#L41)

Machine-readable data for the host.
