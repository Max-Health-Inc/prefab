---
url: /prefab/reference/api/mcp/interfaces/McpServerLike.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / McpServerLike

# Interface: McpServerLike

Defined in: [mcp/resource.ts:240](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L240)

The server shape registerViewerResource needs, structural so any SDK fits; `resource` is the v1 fallback.

## Properties

### server?

```ts
optional server?: object;
```

Defined in: [mcp/resource.ts:244](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L244)

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

Defined in: [mcp/resource.ts:241](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L241)

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

Defined in: [mcp/resource.ts:242](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L242)

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

Defined in: [mcp/resource.ts:246](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/mcp/resource.ts#L246)

Some wrappers expose capability registration directly.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `capabilities` | `CapabilityDeclaration` |

#### Returns

`void`
