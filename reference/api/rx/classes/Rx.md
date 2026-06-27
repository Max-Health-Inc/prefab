---
url: /prefab/reference/api/rx/classes/Rx.md
---
[@maxhealth.tech/prefab](../../index.md) / [rx](../index.md) / Rx

# Class: Rx

Defined in: [rx/rx.ts:16](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L16)

Rx — Reactive expression builder.

Builds template expressions like "{{ count + 1 }}" or "{{ user.name }}"
that are evaluated client-side by the prefab renderer.

Usage:
rx('count')                    → "{{ count }}"
rx('count').add(1)             → "{{ count + 1 }}"
rx('user').dot('name')         → "{{ user.name }}"
rx('items').length()           → "{{ items | length }}"
rx('price').currency('USD')    → "{{ price | currency:'USD' }}"
rx('active').then('Yes', 'No') → "{{ active ? 'Yes' : 'No' }}"

## Constructors

### Constructor

```ts
new Rx(expression): Rx;
```

Defined in: [rx/rx.ts:19](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L19)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expression` | `string` |

#### Returns

`Rx`

## Accessors

### expression

#### Get Signature

```ts
get expression(): string;
```

Defined in: [rx/rx.ts:26](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L26)

Raw expression string without {{ }} wrapper

##### Returns

`string`

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [rx/rx.ts:31](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L31)

Serialize to "{{ expression }}" template string

#### Returns

`string`

***

### toJSON()

```ts
toJSON(): string;
```

Defined in: [rx/rx.ts:35](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L35)

#### Returns

`string`

***

### dot()

```ts
dot(key): Rx;
```

Defined in: [rx/rx.ts:42](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L42)

Dot-path access: rx('user').dot('name') → "{{ user.name }}"

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

#### Returns

`Rx`

***

### at()

```ts
at(index): Rx;
```

Defined in: [rx/rx.ts:47](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L47)

Index access: rx('items').at(0) → "{{ items.0 }}"

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `index` | `number` | `Rx` |

#### Returns

`Rx`

***

### add()

```ts
add(other): Rx;
```

Defined in: [rx/rx.ts:54](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L54)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `string` | `number` | `Rx` |

#### Returns

`Rx`

***

### sub()

```ts
sub(other): Rx;
```

Defined in: [rx/rx.ts:58](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L58)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `string` | `number` | `Rx` |

#### Returns

`Rx`

***

### mul()

```ts
mul(other): Rx;
```

Defined in: [rx/rx.ts:62](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L62)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `string` | `number` | `Rx` |

#### Returns

`Rx`

***

### div()

```ts
div(other): Rx;
```

Defined in: [rx/rx.ts:66](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `string` | `number` | `Rx` |

#### Returns

`Rx`

***

### mod()

```ts
mod(other): Rx;
```

Defined in: [rx/rx.ts:70](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L70)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `string` | `number` | `Rx` |

#### Returns

`Rx`

***

### eq()

```ts
eq(other): Rx;
```

Defined in: [rx/rx.ts:76](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L76)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `unknown` |

#### Returns

`Rx`

***

### neq()

```ts
neq(other): Rx;
```

Defined in: [rx/rx.ts:80](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L80)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `unknown` |

#### Returns

`Rx`

***

### gt()

```ts
gt(other): Rx;
```

Defined in: [rx/rx.ts:84](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L84)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `number` | `Rx` |

#### Returns

`Rx`

***

### gte()

```ts
gte(other): Rx;
```

Defined in: [rx/rx.ts:88](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L88)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `number` | `Rx` |

#### Returns

`Rx`

***

### lt()

```ts
lt(other): Rx;
```

Defined in: [rx/rx.ts:92](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L92)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `number` | `Rx` |

#### Returns

`Rx`

***

### lte()

```ts
lte(other): Rx;
```

Defined in: [rx/rx.ts:96](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L96)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `number` | `Rx` |

#### Returns

`Rx`

***

### and()

```ts
and(other): Rx;
```

Defined in: [rx/rx.ts:102](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L102)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Rx` |

#### Returns

`Rx`

***

### or()

```ts
or(other): Rx;
```

Defined in: [rx/rx.ts:106](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L106)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `other` | `Rx` |

#### Returns

`Rx`

***

### not()

```ts
not(): Rx;
```

Defined in: [rx/rx.ts:110](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L110)

#### Returns

`Rx`

***

### then()

```ts
then(ifTrue, ifFalse): Rx;
```

Defined in: [rx/rx.ts:116](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L116)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `ifTrue` | `unknown` |
| `ifFalse` | `unknown` |

#### Returns

`Rx`

***

### currency()

```ts
currency(code?): Rx;
```

Defined in: [rx/rx.ts:122](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L122)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `code?` | `string` |

#### Returns

`Rx`

***

### percent()

```ts
percent(decimals?): Rx;
```

Defined in: [rx/rx.ts:126](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L126)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `decimals?` | `number` |

#### Returns

`Rx`

***

### number()

```ts
number(decimals?): Rx;
```

Defined in: [rx/rx.ts:130](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L130)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `decimals?` | `number` |

#### Returns

`Rx`

***

### round()

```ts
round(decimals?): Rx;
```

Defined in: [rx/rx.ts:134](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L134)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `decimals` | `number` | `0` |

#### Returns

`Rx`

***

### compact()

```ts
compact(decimals?): Rx;
```

Defined in: [rx/rx.ts:138](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L138)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `decimals?` | `number` |

#### Returns

`Rx`

***

### abs()

```ts
abs(): Rx;
```

Defined in: [rx/rx.ts:142](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L142)

#### Returns

`Rx`

***

### date()

```ts
date(format?): Rx;
```

Defined in: [rx/rx.ts:146](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L146)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `format?` | `string` |

#### Returns

`Rx`

***

### time()

```ts
time(): Rx;
```

Defined in: [rx/rx.ts:150](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L150)

#### Returns

`Rx`

***

### datetime()

```ts
datetime(): Rx;
```

Defined in: [rx/rx.ts:154](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L154)

#### Returns

`Rx`

***

### upper()

```ts
upper(): Rx;
```

Defined in: [rx/rx.ts:158](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L158)

#### Returns

`Rx`

***

### lower()

```ts
lower(): Rx;
```

Defined in: [rx/rx.ts:162](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L162)

#### Returns

`Rx`

***

### truncate()

```ts
truncate(maxLength): Rx;
```

Defined in: [rx/rx.ts:166](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L166)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `maxLength` | `number` |

#### Returns

`Rx`

***

### pluralize()

```ts
pluralize(word?): Rx;
```

Defined in: [rx/rx.ts:170](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L170)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `word?` | `string` |

#### Returns

`Rx`

***

### length()

```ts
length(): Rx;
```

Defined in: [rx/rx.ts:174](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L174)

#### Returns

`Rx`

***

### join()

```ts
join(separator?): Rx;
```

Defined in: [rx/rx.ts:178](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L178)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `separator?` | `string` |

#### Returns

`Rx`

***

### first()

```ts
first(): Rx;
```

Defined in: [rx/rx.ts:182](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L182)

#### Returns

`Rx`

***

### last()

```ts
last(): Rx;
```

Defined in: [rx/rx.ts:186](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L186)

#### Returns

`Rx`

***

### selectattr()

```ts
selectattr(attr): Rx;
```

Defined in: [rx/rx.ts:190](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L190)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `string` |

#### Returns

`Rx`

***

### rejectattr()

```ts
rejectattr(attr): Rx;
```

Defined in: [rx/rx.ts:194](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L194)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `attr` | `string` |

#### Returns

`Rx`

***

### default()

```ts
default(value): Rx;
```

Defined in: [rx/rx.ts:198](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L198)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `unknown` |

#### Returns

`Rx`

***

### pipe()

```ts
pipe(name, ...args): Rx;
```

Defined in: [rx/rx.ts:210](https://github.com/Max-Health-Inc/prefab/blob/b83a59c5090bb060486e2f2a8a35c743b2b469d8/src/rx/rx.ts#L210)

Append an arbitrary pipe filter: `rx('x').pipe('humanName')` → `{{ x | humanName }}`

Supports variadic args: `.pipe('date', 'long')` → `{{ x | date:'long' }}`
Use this for custom pipes registered via `registerPipe()`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| ...`args` | `unknown`\[] |

#### Returns

`Rx`
