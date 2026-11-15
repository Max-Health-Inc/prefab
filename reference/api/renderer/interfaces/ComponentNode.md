---
url: /prefab/reference/api/renderer/interfaces/ComponentNode.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ComponentNode

# Interface: ComponentNode

Defined in: [renderer/engine.ts:56](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/engine.ts#L56)

## Indexable

```ts
[key: string]: unknown
```

## Properties

### type

```ts
type: string;
```

Defined in: [renderer/engine.ts:57](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/engine.ts#L57)

***

### id?

```ts
optional id?: string;
```

Defined in: [renderer/engine.ts:58](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/engine.ts#L58)

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [renderer/engine.ts:59](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/engine.ts#L59)

***

### onMount?

```ts
optional onMount?: ActionJSON | ActionJSON[];
```

Defined in: [renderer/engine.ts:60](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/engine.ts#L60)

***

### children?

```ts
optional children?: ComponentNode[];
```

Defined in: [renderer/engine.ts:61](https://github.com/Max-Health-Inc/prefab/blob/4e102b3517c5a62f380fd91b75fb8c49a1f96cec/src/renderer/engine.ts#L61)
