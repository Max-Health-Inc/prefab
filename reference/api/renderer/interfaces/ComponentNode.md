---
url: /prefab/reference/api/renderer/interfaces/ComponentNode.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ComponentNode

# Interface: ComponentNode

Defined in: [renderer/engine.ts:56](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/renderer/engine.ts#L56)

## Indexable

```ts
[key: string]: unknown
```

## Properties

### type

```ts
type: string;
```

Defined in: [renderer/engine.ts:57](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/renderer/engine.ts#L57)

***

### id?

```ts
optional id?: string;
```

Defined in: [renderer/engine.ts:58](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/renderer/engine.ts#L58)

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [renderer/engine.ts:59](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/renderer/engine.ts#L59)

***

### onMount?

```ts
optional onMount?: ActionJSON | ActionJSON[];
```

Defined in: [renderer/engine.ts:60](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/renderer/engine.ts#L60)

***

### children?

```ts
optional children?: ComponentNode[];
```

Defined in: [renderer/engine.ts:61](https://github.com/Max-Health-Inc/prefab/blob/a243ee4157f94da56581132c47a7cf134a78ad06/src/renderer/engine.ts#L61)
