---
url: /prefab/reference/api/auto/interfaces/JsonSchemaNode.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / JsonSchemaNode

# Interface: JsonSchemaNode

Defined in: [auto/schema.ts:46](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L46)

The JSON Schema keywords a form field can express, read structurally.

Deliberately not a full JSON Schema type: this reads schemas from anywhere
(TypeBox, Zod, a hand-written spec, an OpenAPI document) and only the
keywords below survive the crossing into a control.

## Properties

### type?

```ts
optional type?: string | string[];
```

Defined in: [auto/schema.ts:47](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L47)

***

### format?

```ts
optional format?: string;
```

Defined in: [auto/schema.ts:48](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L48)

***

### title?

```ts
optional title?: string;
```

Defined in: [auto/schema.ts:49](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L49)

***

### description?

```ts
optional description?: string;
```

Defined in: [auto/schema.ts:50](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L50)

***

### enum?

```ts
optional enum?: unknown[];
```

Defined in: [auto/schema.ts:51](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L51)

***

### const?

```ts
optional const?: unknown;
```

Defined in: [auto/schema.ts:52](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L52)

***

### default?

```ts
optional default?: unknown;
```

Defined in: [auto/schema.ts:53](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L53)

***

### properties?

```ts
optional properties?: Record<string, JsonSchemaNode>;
```

Defined in: [auto/schema.ts:54](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L54)

***

### required?

```ts
optional required?: string[];
```

Defined in: [auto/schema.ts:55](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L55)

***

### items?

```ts
optional items?: JsonSchemaNode;
```

Defined in: [auto/schema.ts:56](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L56)

***

### anyOf?

```ts
optional anyOf?: JsonSchemaNode[];
```

Defined in: [auto/schema.ts:57](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L57)

***

### oneOf?

```ts
optional oneOf?: JsonSchemaNode[];
```

Defined in: [auto/schema.ts:58](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L58)

***

### minimum?

```ts
optional minimum?: number;
```

Defined in: [auto/schema.ts:59](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L59)

***

### maximum?

```ts
optional maximum?: number;
```

Defined in: [auto/schema.ts:60](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L60)

***

### minLength?

```ts
optional minLength?: number;
```

Defined in: [auto/schema.ts:61](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L61)

***

### maxLength?

```ts
optional maxLength?: number;
```

Defined in: [auto/schema.ts:62](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L62)

***

### minItems?

```ts
optional minItems?: number;
```

Defined in: [auto/schema.ts:63](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L63)

***

### maxItems?

```ts
optional maxItems?: number;
```

Defined in: [auto/schema.ts:64](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L64)

***

### readOnly?

```ts
optional readOnly?: boolean;
```

Defined in: [auto/schema.ts:65](https://github.com/Max-Health-Inc/prefab/blob/f10bfdb14916287b0bbcf46e9ff8da46562d7a59/src/auto/schema.ts#L65)
