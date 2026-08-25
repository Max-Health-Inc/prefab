---
url: /prefab/reference/api/mcp/interfaces/FormInputRequestOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / FormInputRequestOptions

# Interface: FormInputRequestOptions

Defined in: [mcp/input-required.ts:156](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/input-required.ts#L156)

## Properties

### key?

```ts
optional key?: string;
```

Defined in: [mcp/input-required.ts:161](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/input-required.ts#L161)

Key the request is filed under, and the key the answer comes back on.

#### Default

```ts
'form'
```

***

### message?

```ts
optional message?: string;
```

Defined in: [mcp/input-required.ts:163](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/input-required.ts#L163)

Prompt shown to the user.

#### Default

```ts
the field list's own title, or a generic ask
```

***

### requestState?

```ts
optional requestState?: string;
```

Defined in: [mcp/input-required.ts:165](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/input-required.ts#L165)

Opaque state echoed back on the retry. Sign it; see the SDK's request-state codec.
