/**
 * Control flow & composition components — ForEach, If, Elif, Else, Define, Use, Slot
 */

import { Component, ContainerComponent } from '../../core/component.js'
import type { ContainerProps, ComponentProps, RxStr } from '../../core/component.js'

// ── ForEach ──────────────────────────────────────────────────────────────────

export interface ForEachProps extends ContainerProps {
  expression: RxStr
  let?: Record<string, unknown>
}

export function ForEach(props: ForEachProps): ContainerComponent {
  const c = new ContainerComponent('ForEach', props)
  c.getProps = () => ({
    expression: String(props.expression),
    ...(props.let && { let: props.let }),
  })
  return c
}

// ── If / Elif / Else ─────────────────────────────────────────────────────────

export interface ConditionProps extends ContainerProps {
  condition: RxStr
}

export function If(props: ConditionProps): ContainerComponent {
  const c = new ContainerComponent('If', props)
  c.getProps = () => ({ condition: String(props.condition) })
  return c
}

export function Elif(props: ConditionProps): ContainerComponent {
  const c = new ContainerComponent('Elif', props)
  c.getProps = () => ({ condition: String(props.condition) })
  return c
}

export function Else(props?: ContainerProps): ContainerComponent {
  return new ContainerComponent('Else', props)
}

// ── Define ───────────────────────────────────────────────────────────────────

/**
 * Define a reusable named component template.
 * Goes into the `defs` section of the wire format.
 */
export interface DefineProps extends ContainerProps {
  /** Unique name for this definition. */
  name: string
}

export function Define(props: DefineProps): ContainerComponent {
  const c = new ContainerComponent('Define', props)
  c.getProps = () => ({ name: props.name })
  return c
}

// ── Use ──────────────────────────────────────────────────────────────────────

/**
 * Reference a named definition (from defs).
 * Resolves to the component tree defined by `Define`.
 */
export interface UseProps extends ComponentProps {
  /** Name of the definition to use. */
  def: string
  /** Override props to pass to the definition. */
  overrides?: Record<string, unknown>
}

export function Use(props: UseProps): Component {
  const c = new Component('Use', props)
  c.getProps = () => ({
    def: props.def,
    ...(props.overrides && { overrides: props.overrides }),
  })
  return c
}

// ── Slot ─────────────────────────────────────────────────────────────────────

/**
 * Dynamic content injection point.
 * Used inside `Define` to mark where child content is placed.
 */
export interface SlotProps extends ComponentProps {
  /** Optional named slot identifier. */
  name?: string
  /** Fallback content if no injection provided. */
  fallback?: Component
}

export function Slot(props?: SlotProps): Component {
  const c = new Component('Slot', props)
  c.getProps = () => ({
    ...(props?.name && { name: props.name }),
    ...(props?.fallback && { fallback: props.fallback.toJSON() }),
  })
  return c
}
