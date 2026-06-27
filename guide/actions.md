---
url: /prefab/guide/actions.md
description: >-
  How to attach actions to components — CallTool, SetState, ShowToast, Navigate,
  and other serializable event handlers for MCP Apps.
---

# Actions

Actions are how a prefab UI does something. They are small, serializable commands you attach to a component event — `onClick`, `onChange`, `onSubmit`, or the app-level `onMount`. Because they are plain data (not closures), they travel across the wire and run wherever the renderer lives, which is what makes interactivity possible in an MCP App.

## Two execution models

Every action falls into one of two camps:

* **Client-side** actions resolve entirely in the renderer with no server roundtrip. Setting state, toggling a flag, showing a toast, opening a link, or picking a file all happen instantly in the browser.
* **MCP transport** actions take a roundtrip through the host — calling a tool, sending a chat message, or updating shared context. These are how your UI reaches back into the server that produced it.

Reaching for the right camp is usually obvious: if the work is purely visual or local, keep it client-side; if it needs the model or your backend, call a tool.

## Chaining with onSuccess and onError

Most actions accept `onSuccess` and `onError` options, each taking a single action or an array of them. This lets you compose flows declaratively — save a record, then flip a flag and show a success toast, and surface an error toast if it fails — without writing any imperative glue.

```ts
Button('Save & Notify', {
  onClick: CallTool('save_item', {
    arguments: { name: rx`${STATE}.name` },
    onSuccess: [SetState('saved', true), ShowToast('Saved!', { variant: 'success' })],
    onError: ShowToast('Save failed', { variant: 'error' }),
  }),
})
```

## Lifecycle: running on mount

Actions are not limited to user gestures. Pass `onMount` to `display()` to run an action the moment the UI first renders — perfect for loading initial data or opening a real-time subscription so the view arrives already populated.

## When to use the builder sugar

For the state-mutating actions (`set`, `toggle`, `append`, `pop`), prefab ships ergonomic wrappers that accept a `Signal` or `Collection` instead of a raw string key. Prefer them whenever you already model your state with signals: you keep type safety, avoid stringly-typed keys, and produce the exact same wire-format actions. Drop down to the raw action classes when you need a one-off or are working without a signal.

→ See the [Actions reference](/reference/actions) for the full catalog: every action, its parameters, and wire JSON.
