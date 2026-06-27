---
url: /prefab/reference/api/actions.md
---
[@maxhealth.tech/prefab](../index.md) / actions

# actions

## Classes

| Class | Description |
| ------ | ------ |
| [SetState](classes/SetState.md) | Base interface all actions implement |
| [ToggleState](classes/ToggleState.md) | Base interface all actions implement |
| [AppendState](classes/AppendState.md) | Base interface all actions implement |
| [PopState](classes/PopState.md) | Base interface all actions implement |
| [ShowToast](classes/ShowToast.md) | Base interface all actions implement |
| [CloseOverlay](classes/CloseOverlay.md) | Base interface all actions implement |
| [OpenLink](classes/OpenLink.md) | Base interface all actions implement |
| [SetInterval](classes/SetInterval.md) | Base interface all actions implement |
| [Fetch](classes/Fetch.md) | Base interface all actions implement |
| [OpenFilePicker](classes/OpenFilePicker.md) | Base interface all actions implement |
| [CallHandler](classes/CallHandler.md) | Base interface all actions implement |
| [CallTool](classes/CallTool.md) | Invoke an MCP tool from the UI. Used in Form.onSubmit or Button.onClick to call backend tools. |
| [SendMessage](classes/SendMessage.md) | Base interface all actions implement |
| [UpdateContext](classes/UpdateContext.md) | Base interface all actions implement |
| [RequestDisplayMode](classes/RequestDisplayMode.md) | Base interface all actions implement |
| [Subscribe](classes/Subscribe.md) | Subscribe to a resource URI for real-time updates. |
| [Unsubscribe](classes/Unsubscribe.md) | Unsubscribe from a previously subscribed resource URI. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [SetStateOpts](interfaces/SetStateOpts.md) | - |
| [ShowToastOpts](interfaces/ShowToastOpts.md) | - |
| [FetchOpts](interfaces/FetchOpts.md) | - |
| [OpenFilePickerOpts](interfaces/OpenFilePickerOpts.md) | - |
| [CallHandlerOpts](interfaces/CallHandlerOpts.md) | - |
| [CallToolOpts](interfaces/CallToolOpts.md) | - |
| [SubscribeOpts](interfaces/SubscribeOpts.md) | - |
| [ActionJSON](interfaces/ActionJSON.md) | Serialized action JSON |
| [Action](interfaces/Action.md) | Base interface all actions implement |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ToastVariant](type-aliases/ToastVariant.md) | - |
| [DisplayMode](type-aliases/DisplayMode.md) | - |
| [StateTarget](type-aliases/StateTarget.md) | Anything that resolves to a state key: Signal, Collection, or raw string. |

## Functions

| Function | Description |
| ------ | ------ |
| [set](functions/set.md) | Set a state value. `set(signal, value)` → `new SetState(signal.key, value)` |
| [toggle](functions/toggle.md) | Toggle a boolean state value. `toggle(signal)` → `new ToggleState(signal.key)` |
| [append](functions/append.md) | Append an item to an array state value. Optionally specify insertion index. |
| [pop](functions/pop.md) | Remove an element from an array by index or value. Defaults to last element (-1). |
| [serializeCallbacks](functions/serializeCallbacks.md) | Serialize one or more actions to their JSON form. |
