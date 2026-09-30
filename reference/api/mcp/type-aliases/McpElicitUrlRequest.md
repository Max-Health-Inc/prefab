---
url: /prefab/reference/api/mcp/type-aliases/McpElicitUrlRequest.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpElicitUrlRequest

# Type Alias: McpElicitUrlRequest

```ts
type McpElicitUrlRequest = object;
```

Defined in: [mcp/types.ts:249](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/mcp/types.ts#L249)

URL-mode elicitation: the client sends the user out of band and reports back.

## Properties

### method

```ts
method: "elicitation/create";
```

Defined in: [mcp/types.ts:250](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/mcp/types.ts#L250)

***

### params

```ts
params: object;
```

Defined in: [mcp/types.ts:251](https://github.com/Max-Health-Inc/prefab/blob/605eb676dc900a2603365e87c9dd47f400d7af46/src/mcp/types.ts#L251)

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
