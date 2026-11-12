---
url: /prefab/reference/api/mcp/type-aliases/McpElicitFormRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpElicitFormRequest

# Type Alias: McpElicitFormRequest

```ts
type McpElicitFormRequest = object;
```

Defined in: [mcp/types.ts:151](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L151)

Form-mode elicitation: the client renders the schema and returns the values.

## Properties

### method

```ts
method: "elicitation/create";
```

Defined in: [mcp/types.ts:152](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L152)

***

### params

```ts
params: object;
```

Defined in: [mcp/types.ts:153](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/types.ts#L153)

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
