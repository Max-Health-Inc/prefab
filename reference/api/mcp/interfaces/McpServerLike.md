---
url: /prefab/reference/api/mcp/interfaces/McpServerLike.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpServerLike

# Interface: McpServerLike

Defined in: [mcp/resource.ts:235](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L235)

The server shape registerViewerResource needs, structural so any SDK fits; `resource` is the v1 fallback.

## Properties

### server?

```ts
optional server?: object;
```

Defined in: [mcp/resource.ts:239](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L239)

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

Defined in: [mcp/resource.ts:236](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L236)

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

Defined in: [mcp/resource.ts:237](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L237)

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

Defined in: [mcp/resource.ts:241](https://github.com/Max-Health-Inc/prefab/blob/5d922c94bbfabe05e60f323caa169b4411113582/src/mcp/resource.ts#L241)

Some wrappers expose capability registration directly.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `capabilities` | `CapabilityDeclaration` |

#### Returns

`void`
