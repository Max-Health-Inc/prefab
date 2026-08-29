---
url: /prefab/reference/api/auto/classes/QuickFormBuilder.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / QuickFormBuilder

# Class: QuickFormBuilder

Defined in: [auto/form.ts:161](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L161)

Chainable form builder for rapid MCP tool UI generation.

## Example

```ts
const ui = QuickForm('create_user')
  .title('Create User')
  .text('name', { required: true })
  .email('email', { required: true })
  .submit('Create')
  .build()
```

## Constructors

### Constructor

```ts
new QuickFormBuilder(toolName): QuickFormBuilder;
```

Defined in: [auto/form.ts:171](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L171)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `toolName` | `string` |

#### Returns

`QuickFormBuilder`

## Methods

### title()

```ts
title(t): this;
```

Defined in: [auto/form.ts:175](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L175)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `t` | `string` |

#### Returns

`this`

***

### subtitle()

```ts
subtitle(s): this;
```

Defined in: [auto/form.ts:176](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L176)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `s` | `string` |

#### Returns

`this`

***

### submit()

```ts
submit(label): this;
```

Defined in: [auto/form.ts:177](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L177)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |

#### Returns

`this`

***

### onSubmit()

```ts
onSubmit(action): this;
```

Defined in: [auto/form.ts:178](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L178)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `action` | | [`Action`](../../actions/interfaces/Action.md) | [`Action`](../../actions/interfaces/Action.md)\[] |

#### Returns

`this`

***

### successMessage()

```ts
successMessage(msg): this;
```

Defined in: [auto/form.ts:179](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L179)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `msg` | `string` |

#### Returns

`this`

***

### errorMessage()

```ts
errorMessage(msg): this;
```

Defined in: [auto/form.ts:180](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L180)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `msg` | `string` |

#### Returns

`this`

***

### field()

```ts
field(name, opts?): this;
```

Defined in: [auto/form.ts:183](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L183)

Add a field with explicit type.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"name"`> |

#### Returns

`this`

***

### text()

```ts
text(name, opts?): this;
```

Defined in: [auto/form.ts:189](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L189)

Shorthand for type: 'text'.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"type"` | `"name"`> |

#### Returns

`this`

***

### email()

```ts
email(name, opts?): this;
```

Defined in: [auto/form.ts:194](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L194)

Shorthand for type: 'email'.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"type"` | `"name"`> |

#### Returns

`this`

***

### number()

```ts
number(name, opts?): this;
```

Defined in: [auto/form.ts:199](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L199)

Shorthand for type: 'number'.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"type"` | `"name"`> |

#### Returns

`this`

***

### password()

```ts
password(name, opts?): this;
```

Defined in: [auto/form.ts:204](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L204)

Shorthand for type: 'password'.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"type"` | `"name"`> |

#### Returns

`this`

***

### url()

```ts
url(name, opts?): this;
```

Defined in: [auto/form.ts:209](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L209)

Shorthand for type: 'url'.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"type"` | `"name"`> |

#### Returns

`this`

***

### tel()

```ts
tel(name, opts?): this;
```

Defined in: [auto/form.ts:214](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L214)

Shorthand for type: 'tel'.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `opts?` | `Omit`<[`AutoFormField`](../interfaces/AutoFormField.md), `"type"` | `"name"`> |

#### Returns

`this`

***

### build()

```ts
build(): ContainerComponent;
```

Defined in: [auto/form.ts:219](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/auto/form.ts#L219)

Build the form component tree.

#### Returns

`ContainerComponent`
