/**
 * Media components — Image, Audio, Video, Embed, Svg, DropZone, Mermaid
 */

import { Component } from '../../core/component.js'
import type { ComponentProps, RxStr } from '../../core/component.js'
import type { Action } from '../../actions/types.js'

export interface ImageProps extends ComponentProps {
  src: string
  alt?: string
}

/**
 * Image component.
 *
 * @example Positional (consistent with Audio, Video, Embed):
 * ```ts
 * Image('https://example.com/photo.jpg', { alt: 'Photo' })
 * ```
 *
 * @example Props form:
 * ```ts
 * Image({ src: 'https://example.com/photo.jpg', alt: 'Photo' })
 * ```
 */
export function Image(srcOrProps: string | ImageProps, opts?: Omit<ImageProps, 'src'>): Component {
  const src = typeof srcOrProps === 'string' ? srcOrProps : srcOrProps.src
  const alt = typeof srcOrProps === 'string' ? opts?.alt : srcOrProps.alt
  const baseProps = typeof srcOrProps === 'string' ? opts : srcOrProps
  const c = new Component('Image', baseProps)
  c.getProps = () => ({
    src,
    ...(alt && { alt }),
  })
  return c
}

export function Audio(src: string, props?: ComponentProps): Component {
  const c = new Component('Audio', props)
  c.getProps = () => ({ src })
  return c
}

export function Video(src: string, props?: ComponentProps): Component {
  const c = new Component('Video', props)
  c.getProps = () => ({ src })
  return c
}

export function Embed(src: string, props?: ComponentProps): Component {
  const c = new Component('Embed', props)
  c.getProps = () => ({ src })
  return c
}

export function Svg(content: string, props?: ComponentProps): Component {
  const c = new Component('Svg', props)
  c.getProps = () => ({ content })
  return c
}

/**
 * Prop names mirror the `OpenFilePicker` action, which already defines how files
 * reach state in prefab: chosen files land under `resultKey`, and callbacks get
 * them as `$result`.
 */
export interface DropZoneProps extends ComponentProps {
  /** Prompt shown inside the drop area. @default 'Drop files here' */
  label?: RxStr
  /** Accepted file types, in the same form as the HTML `accept` attribute. */
  accept?: string
  /** Allow more than one file. */
  multiple?: boolean
  /** State key the chosen files are written to. */
  resultKey?: string
  /** Actions fired once files are chosen, with `$result` bound to the file list. */
  onDrop?: Action | Action[]
}

export function DropZone(props?: DropZoneProps): Component {
  const c = new Component('DropZone', props)
  c.getProps = () => ({
    ...(props?.label !== undefined && { label: props.label }),
    ...(props?.accept && { accept: props.accept }),
    ...(props?.multiple !== undefined && { multiple: props.multiple }),
    ...(props?.resultKey && { resultKey: props.resultKey }),
    ...(props?.onDrop && {
      onDrop: Array.isArray(props.onDrop)
        ? props.onDrop.map(a => a.toJSON())
        : props.onDrop.toJSON(),
    }),
  })
  return c
}

export function Mermaid(content: string, props?: ComponentProps): Component {
  const c = new Component('Mermaid', props)
  c.getProps = () => ({ content })
  return c
}
