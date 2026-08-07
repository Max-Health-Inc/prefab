---
url: /prefab/reference/api/renderer/interfaces/ComponentNode.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ComponentNode

# Interface: ComponentNode

Defined in: [renderer/engine.ts:46](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L46)

## Indexable

```ts
[key: string]: unknown
```

## Properties

### type

```ts
type: string;
```

Defined in: [renderer/engine.ts:47](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L47)

***

### id?

```ts
optional id?: string;
```

Defined in: [renderer/engine.ts:48](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L48)

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [renderer/engine.ts:49](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L49)

***

### onMount?

```ts
optional onMount?: ActionJSON | ActionJSON[];
```

Defined in: [renderer/engine.ts:50](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L50)

***

### children?

```ts
optional children?: ComponentNode[];
```

Defined in: [renderer/engine.ts:51](https://github.com/Max-Health-Inc/prefab/blob/0dee3f097b962b3af8a18839ee1ad4ad8bc3ef8e/src/renderer/engine.ts#L51)
