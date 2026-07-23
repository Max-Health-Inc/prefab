---
url: /prefab/reference/api/renderer/interfaces/ComponentNode.md
---
[@maxhealth.tech/prefab](../../index.md) / [renderer](../index.md) / ComponentNode

# Interface: ComponentNode

Defined in: [renderer/engine.ts:45](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L45)

## Indexable

```ts
[key: string]: unknown
```

## Properties

### type

```ts
type: string;
```

Defined in: [renderer/engine.ts:46](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L46)

***

### id?

```ts
optional id?: string;
```

Defined in: [renderer/engine.ts:47](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L47)

***

### cssClass?

```ts
optional cssClass?: string;
```

Defined in: [renderer/engine.ts:48](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L48)

***

### onMount?

```ts
optional onMount?: ActionJSON | ActionJSON[];
```

Defined in: [renderer/engine.ts:49](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L49)

***

### children?

```ts
optional children?: ComponentNode[];
```

Defined in: [renderer/engine.ts:50](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/renderer/engine.ts#L50)
