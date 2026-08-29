---
url: /prefab/reference/api/actions/interfaces/FetchOpts.md
---
[@maxhealth.tech/prefab](../../index.md) / [actions](../index.md) / FetchOpts

# Interface: FetchOpts

Defined in: [actions/client.ts:143](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L143)

## Properties

### method?

```ts
optional method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
```

Defined in: [actions/client.ts:144](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L144)

***

### headers?

```ts
optional headers?: Record<string, string>;
```

Defined in: [actions/client.ts:145](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L145)

***

### body?

```ts
optional body?: unknown;
```

Defined in: [actions/client.ts:146](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L146)

***

### resultKey?

```ts
optional resultKey?: string;
```

Defined in: [actions/client.ts:147](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L147)

***

### onSuccess?

```ts
optional onSuccess?: Action | Action[];
```

Defined in: [actions/client.ts:148](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L148)

***

### onError?

```ts
optional onError?: Action | Action[];
```

Defined in: [actions/client.ts:149](https://github.com/Max-Health-Inc/prefab/blob/aa67e4221b5f555a8968efb11584ea9d113e4659/src/actions/client.ts#L149)
