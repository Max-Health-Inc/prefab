---
url: /prefab/reference/api/mcp/type-aliases/McpElicitUrlRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpElicitUrlRequest

# Type Alias: McpElicitUrlRequest

```ts
type McpElicitUrlRequest = object;
```

Defined in: [mcp/types.ts:161](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L161)

URL-mode elicitation: the client sends the user out of band and reports back.

## Properties

### method

```ts
method: "elicitation/create";
```

Defined in: [mcp/types.ts:162](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L162)

***

### params

```ts
params: object;
```

Defined in: [mcp/types.ts:163](https://github.com/Max-Health-Inc/prefab/blob/14b051946911add90406e1cbcaccfa458027e0bf/src/mcp/types.ts#L163)

#### mode

```ts
mode: "url";
```

#### message

```ts
message: string;
```

#### url

```ts
url: string;
```
