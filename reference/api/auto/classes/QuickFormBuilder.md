---
url: /prefab/reference/api/auto/classes/QuickFormBuilder.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / QuickFormBuilder

# Class: QuickFormBuilder

Defined in: [auto/form.ts:155](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L155)

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

Defined in: [auto/form.ts:165](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L165)

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

Defined in: [auto/form.ts:169](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L169)

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

Defined in: [auto/form.ts:170](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L170)

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

Defined in: [auto/form.ts:171](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L171)

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

Defined in: [auto/form.ts:172](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L172)

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

Defined in: [auto/form.ts:173](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L173)

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

Defined in: [auto/form.ts:174](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L174)

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

Defined in: [auto/form.ts:177](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L177)

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

Defined in: [auto/form.ts:183](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L183)

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

Defined in: [auto/form.ts:188](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L188)

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

Defined in: [auto/form.ts:193](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L193)

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

Defined in: [auto/form.ts:198](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L198)

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

Defined in: [auto/form.ts:203](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L203)

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

Defined in: [auto/form.ts:208](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L208)

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

Defined in: [auto/form.ts:213](https://github.com/Max-Health-Inc/prefab/blob/628b042e962441e68b03efc956b348960b1f0f49/src/auto/form.ts#L213)

Build the form component tree.

#### Returns

`ContainerComponent`
