---
url: /prefab/reference/api/mcp/type-aliases/PrefabUpdateWire.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / PrefabUpdateWire

# Type Alias: PrefabUpdateWire

```ts
type PrefabUpdateWire = object;
```

Defined in: [mcp/display.ts:226](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/mcp/display.ts#L226)

The `$prefab` state-delta payload, sent as `structuredContent`.

A type alias rather than an interface for the same reason as
PrefabWireFormat: interfaces get no implicit index signature, so an
interface here cannot be assigned to the SDK's
`structuredContent?: { [x: string]: unknown }`. Guarded by
`test/mcp-types.test.ts`.

## Properties

### $prefab

```ts
$prefab: object;
```

Defined in: [mcp/display.ts:227](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/mcp/display.ts#L227)

#### version

```ts
version: string;
```

***

### update

```ts
update: StateUpdate;
```

Defined in: [mcp/display.ts:228](https://github.com/Max-Health-Inc/prefab/blob/c0556f0632cf75f3e410fd7efc1a25abaf224e54/src/mcp/display.ts#L228)
