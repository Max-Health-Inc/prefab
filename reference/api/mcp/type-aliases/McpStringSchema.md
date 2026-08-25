---
url: /prefab/reference/api/mcp/type-aliases/McpStringSchema.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpStringSchema

# Type Alias: McpStringSchema

```ts
type McpStringSchema = object;
```

Defined in: [mcp/types.ts:178](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L178)

The restricted JSON Schema an elicitation may request.

Protocol revision 2026-07-28 replaced server-initiated `elicitation/create`
pushes with Multi Round-Trip Requests: a handler *returns* an
[McpInputRequiredResult](McpInputRequiredResult.md), the client answers the embedded requests and
retries the original call. The schema is deliberately flat — top-level
primitive properties only, no nesting — because it has to render as a form in
hosts that have no UI surface of their own.

## Properties

### type

```ts
type: "string";
```

Defined in: [mcp/types.ts:179](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L179)

***

### title?

```ts
optional title?: string;
```

Defined in: [mcp/types.ts:180](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L180)

***

### description?

```ts
optional description?: string;
```

Defined in: [mcp/types.ts:181](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L181)

***

### minLength?

```ts
optional minLength?: number;
```

Defined in: [mcp/types.ts:182](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L182)

***

### maxLength?

```ts
optional maxLength?: number;
```

Defined in: [mcp/types.ts:183](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L183)

***

### format?

```ts
optional format?: "email" | "uri" | "date" | "date-time";
```

Defined in: [mcp/types.ts:184](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L184)

***

### default?

```ts
optional default?: string;
```

Defined in: [mcp/types.ts:185](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/types.ts#L185)
