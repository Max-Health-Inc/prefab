---
url: /prefab/reference/api/mcp/interfaces/McpServerLike.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpServerLike

# Interface: McpServerLike

Defined in: [mcp/resource.ts:306](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L306)

MCP server interface expected by registerViewerResource.

Structural rather than an SDK import, so fastmcp and hand-rolled servers stay
compatible. `registerResource` is preferred; `resource` is the v1 overload
that v2 retired and is used only as a fallback.

## Properties

### server?

```ts
optional server?: object;
```

Defined in: [mcp/resource.ts:310](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L310)

Low-level server, where both SDK generations expose capability registration.

#### registerCapabilities()?

```ts
optional registerCapabilities(capabilities): void;
```

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `capabilities` | `CapabilityDeclaration` |

##### Returns

`void`

## Methods

### registerResource()?

```ts
optional registerResource(
   name, 
   uri, 
   config, 
   handler): unknown;
```

Defined in: [mcp/resource.ts:307](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L307)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `uri` | `string` |
| `config` | [`ResourceConfig`](ResourceConfig.md) |
| `handler` | [`ResourceReadHandler`](../type-aliases/ResourceReadHandler.md) |

#### Returns

`unknown`

***

### resource()?

```ts
optional resource(
   name, 
   uri, 
   config, 
   handler): unknown;
```

Defined in: [mcp/resource.ts:308](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L308)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `uri` | `string` |
| `config` | [`ResourceConfig`](ResourceConfig.md) |
| `handler` | [`ResourceReadHandler`](../type-aliases/ResourceReadHandler.md) |

#### Returns

`unknown`

***

### registerCapabilities()?

```ts
optional registerCapabilities(capabilities): void;
```

Defined in: [mcp/resource.ts:312](https://github.com/Max-Health-Inc/prefab/blob/e42e8c82c07c073f15ca30bb919aca4001f57a2f/src/mcp/resource.ts#L312)

Some wrappers expose capability registration directly.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `capabilities` | `CapabilityDeclaration` |

#### Returns

`void`
