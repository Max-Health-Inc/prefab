/**
 * Media components — Image, Audio, Video, Embed, Svg, DropZone, Mermaid
 */

import { Component } from '../../core/component.js'
import type { ComponentProps } from '../../core/component.js'

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

export function DropZone(props?: ComponentProps): Component {
  return new Component('DropZone', props)
}

export function Mermaid(content: string, props?: ComponentProps): Component {
  const c = new Component('Mermaid', props)
  c.getProps = () => ({ content })
  return c
}
