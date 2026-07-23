---
url: /prefab/reference/api/auto/classes/QuickFormBuilder.md
---
[@maxhealth.tech/prefab](../../index.md) / [auto](../index.md) / QuickFormBuilder

# Class: QuickFormBuilder

Defined in: [auto/form.ts:116](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L116)

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

Defined in: [auto/form.ts:126](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L126)

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

Defined in: [auto/form.ts:130](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L130)

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

Defined in: [auto/form.ts:131](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L131)

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

Defined in: [auto/form.ts:132](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L132)

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

Defined in: [auto/form.ts:133](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L133)

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

Defined in: [auto/form.ts:134](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L134)

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

Defined in: [auto/form.ts:135](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L135)

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

Defined in: [auto/form.ts:138](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L138)

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

Defined in: [auto/form.ts:144](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L144)

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

Defined in: [auto/form.ts:149](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L149)

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

Defined in: [auto/form.ts:154](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L154)

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

Defined in: [auto/form.ts:159](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L159)

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

Defined in: [auto/form.ts:164](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L164)

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

Defined in: [auto/form.ts:169](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L169)

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

Defined in: [auto/form.ts:174](https://github.com/Max-Health-Inc/prefab/blob/688ae1b61b495802665777493395730e1d463211/src/auto/form.ts#L174)

Build the form component tree.

#### Returns

`ContainerComponent`
