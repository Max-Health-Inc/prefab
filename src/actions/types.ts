/**
 * Action type definitions.
 *
 * Actions are serializable commands that the prefab renderer executes
 * client-side (setState, showToast) or via MCP transport (callTool).
 */

/** Serialized action JSON */
export interface ActionJSON {
  action: string
  [key: string]: unknown
}

/** Base interface all actions implement */
export interface Action {
  toJSON(): ActionJSON
}

/** Serialize one or more actions to their JSON form. */
export function serializeCallbacks(actions: Action | Action[]): ActionJSON | ActionJSON[] {
  return Array.isArray(actions) ? actions.map(a => a.toJSON()) : actions.toJSON()
}
