---
url: /prefab/reference/api/mcp/interfaces/FormInputRequestOptions.md
---
[@maxhealth.tech/prefab](../../index.md) / [mcp](../index.md) / FormInputRequestOptions

# Interface: FormInputRequestOptions

Defined in: [mcp/input-required.ts:149](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/input-required.ts#L149)

## Properties

### key?

```ts
optional key?: string;
```

Defined in: [mcp/input-required.ts:154](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/input-required.ts#L154)

Key the request is filed under, and the key the answer comes back on.

#### Default

```ts
'form'
```

***

### message?

```ts
optional message?: string;
```

Defined in: [mcp/input-required.ts:156](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/input-required.ts#L156)

Prompt shown to the user.

#### Default

```ts
the field list's own title, or a generic ask
```

***

### requestState?

```ts
optional requestState?: string;
```

Defined in: [mcp/input-required.ts:158](https://github.com/Max-Health-Inc/prefab/blob/1890bd36e825570eeb35b14d1f5a0235caa2c0fb/src/mcp/input-required.ts#L158)

Opaque state echoed back on the retry. Sign it; see the SDK's request-state codec.
