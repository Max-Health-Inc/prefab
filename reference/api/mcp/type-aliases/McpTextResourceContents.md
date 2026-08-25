---
url: /prefab/reference/api/mcp/type-aliases/McpTextResourceContents.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpTextResourceContents

# Type Alias: McpTextResourceContents

```ts
type McpTextResourceContents = object;
```

Defined in: [mcp/types.ts:54](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L54)

Text resource contents (has `text`, never `blob`).

Declared as a type alias, not an interface, and the difference is load-bearing.
The SDK's resource types are passthrough (`{ [x: string]: unknown }`), and
TypeScript grants an *implicit index signature* only to type aliases of object
types — never to interfaces, since an interface can be reopened by declaration
merging and so its key set is not final. Declaring this as an interface makes
it fail to satisfy the SDK's shape with "Index signature for type 'string' is
missing", which a consumer can only work around by casting.

## Properties

### uri

```ts
uri: string;
```

Defined in: [mcp/types.ts:55](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L55)

***

### mimeType?

```ts
optional mimeType?: string;
```

Defined in: [mcp/types.ts:56](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L56)

***

### text

```ts
text: string;
```

Defined in: [mcp/types.ts:57](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L57)

***

### \_meta?

```ts
optional _meta?: Record<string, unknown>;
```

Defined in: [mcp/types.ts:58](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L58)
