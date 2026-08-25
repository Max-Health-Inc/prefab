---
url: /prefab/reference/api/mcp/interfaces/McpServerLike.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpServerLike

# Interface: McpServerLike

Defined in: [mcp/resource.ts:307](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/resource.ts#L307)

MCP server interface expected by registerViewerResource.

Structural rather than an SDK import, so fastmcp and hand-rolled servers stay
compatible. `registerResource` is preferred; `resource` is the v1 overload
that v2 retired and is used only as a fallback.

## Properties

### server?

```ts
optional server?: object;
```

Defined in: [mcp/resource.ts:311](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/resource.ts#L311)

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

Defined in: [mcp/resource.ts:308](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/resource.ts#L308)

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

Defined in: [mcp/resource.ts:309](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/resource.ts#L309)

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

Defined in: [mcp/resource.ts:313](https://github.com/Max-Health-Inc/prefab/blob/d7d649bdd9803c681488f2ff36bdb77dd5c1434f/src/mcp/resource.ts#L313)

Some wrappers expose capability registration directly.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `capabilities` | `CapabilityDeclaration` |

#### Returns

`void`
