---
url: /prefab/reference/api/renderer.md
---
[@maxhealth.tech/prefab](../index.md) / renderer

# renderer

## Classes

| Class | Description |
| ------ | ------ |
| [Bridge](classes/Bridge.md) | - |
| [DestroyRegistry](classes/DestroyRegistry.md) | Tracks destroy callbacks for mounted components within a render cycle. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [AppOptions](interfaces/AppOptions.md) | - |
| [PrefabApp](interfaces/PrefabApp.md) | - |
| [MountHandle](interfaces/MountHandle.md) | - |
| [BridgeMessage](interfaces/BridgeMessage.md) | - |
| [AppCapabilities](interfaces/AppCapabilities.md) | - |
| [HostCapabilities](interfaces/HostCapabilities.md) | - |
| [HostContext](interfaces/HostContext.md) | - |
| [HostTheme](interfaces/HostTheme.md) | - |
| [ComponentNode](interfaces/ComponentNode.md) | - |
| [RenderContext](interfaces/RenderContext.md) | - |
| [RenderResult](interfaces/RenderResult.md) | Result of a render function that includes a cleanup callback. |
| [PrefabWireData](interfaces/PrefabWireData.md) | - |
| [PrefabUpdateData](interfaces/PrefabUpdateData.md) | - |
| [MountOptions](interfaces/MountOptions.md) | - |
| [MountedApp](interfaces/MountedApp.md) | - |
| [ThemeToggleOptions](interfaces/ThemeToggleOptions.md) | - |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [DisplayMode](type-aliases/DisplayMode.md) | - |
| [RenderFnReturn](type-aliases/RenderFnReturn.md) | - |
| [RenderFn](type-aliases/RenderFn.md) | - |

## Variables

| Variable | Description |
| ------ | ------ |
| [PrefabRenderer](variables/PrefabRenderer.md) | - |

## Functions

| Function | Description |
| ------ | ------ |
| [app](functions/app.md) | Create a prefab app. Auto-detects iframe vs standalone. |
| [applyHostTheme](functions/applyHostTheme.md) | - |
| [isIframe](functions/isIframe.md) | - |
| [registerComponent](functions/registerComponent.md) | Register a render function for a component type |
| [createThemeToggle](functions/createThemeToggle.md) | Create a theme toggle button inside a prefab root element. |

## References

### registerPipe

Re-exports [registerPipe](../rx/functions/registerPipe.md)

***

### unregisterPipe

Re-exports [unregisterPipe](../rx/functions/unregisterPipe.md)

***

### listPipes

Re-exports [listPipes](../rx/functions/listPipes.md)

***

### PipeFn

Re-exports [PipeFn](../rx/type-aliases/PipeFn.md)
