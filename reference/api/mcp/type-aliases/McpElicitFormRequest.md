---
url: /prefab/reference/api/mcp/type-aliases/McpElicitFormRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpElicitFormRequest

# Type Alias: McpElicitFormRequest

```ts
type McpElicitFormRequest = object;
```

Defined in: [mcp/types.ts:239](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/types.ts#L239)

Form-mode elicitation: the client renders the schema and returns the values.

## Properties

### method

```ts
method: "elicitation/create";
```

Defined in: [mcp/types.ts:240](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/types.ts#L240)

***

### params

```ts
params: object;
```

Defined in: [mcp/types.ts:241](https://github.com/Max-Health-Inc/prefab/blob/dc9055d700a7e96734dfd959d1cb775e88a3b293/src/mcp/types.ts#L241)

#### mode?

```ts
optional mode?: "form";
```

#### message

```ts
message: string;
```

#### requestedSchema

```ts
requestedSchema: McpRestrictedSchema;
```
