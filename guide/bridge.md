---
url: /prefab/guide/bridge.md
description: >-
  PostMessage bridge connecting prefab iframes to MCP Apps hosts (VS Code,
  Claude, ChatGPT) via prefab:* and ui/* JSON-RPC protocols.
---

# PostMessage Bridge

When a prefab app renders inside an MCP Apps host like VS Code, Claude, or ChatGPT, it lives in a sandboxed iframe. The bridge is what lets that iframe and its host hold a conversation — passing tool input in, sending tool calls and chat messages out, and reacting to theme or context changes — all over the browser's `postMessage` channel.

## Two protocols, one bridge

The bridge speaks two message dialects at once, so the same app works across hosts that disagree on conventions:

* **`prefab:*`** — the custom, prefab-native protocol (for example `prefab:tool-input`, `prefab:tool-call`).
* **`ui/*`** — the JSON-RPC dialect from the [MCP Apps spec](https://modelcontextprotocol.io), which standards-based hosts prefer.

You never choose between them. The bridge negotiates the right one during connection and translates underneath, so your code stays the same regardless of which host loaded it.

## Connection lifecycle

Every session opens with a short handshake. The app announces the capabilities it supports, the host replies with its own capabilities plus the active theme, and from there messages flow both ways for the life of the iframe. Tool input arrives, your app renders, tool calls go back out, and either side can tear the connection down cleanly when it's done. The host can also push updates mid-session — a theme switch or a fresh context payload (locale, access tokens, and the like) — which your handlers receive as they happen.

## High-level vs. low-level

Most apps only ever touch the high-level **`prefab.app()`** factory. It auto-detects whether you're in an iframe or running standalone, runs the handshake for you, applies the host theme, and hands back a ready-to-use `PrefabApp` object with friendly methods like `onToolInput`, `render`, and `callTool`.

```html
<script src="renderer.min.js"></script>
<script>
  (async () => {
    const ui = await prefab.app();

    ui.onToolInput((args) => {
      ui.render('#root', { type: 'H1', content: `Hello ${args.name}!` });
    });
  })();
</script>
```

If you need finer control — a custom transport, your own handshake timing, or raw message handling — reach for the low-level **`Bridge`** class instead. It exposes the wire directly: connect, initialize, subscribe to raw message types, and disconnect yourself. The factory is built on top of it, so you lose convenience but gain control.

## A note on origin security

By default the bridge accepts messages from any origin (`'*'`), which is fine for local development but unsafe in production. Always pass an explicit `hostOrigin` so the bridge only trusts messages from your real host. It validates incoming `event.origin`, correlates tool responses by id to prevent spoofing, and times out stalled tool calls — but the origin you set is the first line of defense.

→ See the [Renderer API reference](/reference/api/renderer/) for the full API: the `Bridge` class, the `PrefabApp` methods, and the `app()` factory.
