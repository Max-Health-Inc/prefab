/**
 * Tests for the zero-dependency centralized logger.
 *
 * Mirrors the @maxhealth.tech/utils `createLogger` contract (scoped
 * error/warn/info/debug) but stays dependency-free and adds a runtime level
 * so embedding hosts can mute prefab's console output. This is the single sink
 * every prefab `console.*` call should route through.
 */

import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { createLogger, log, setLogLevel, getLogLevel } from '../src/core/logger'

let warnSpy: ReturnType<typeof spyOn>
let errorSpy: ReturnType<typeof spyOn>
let infoSpy: ReturnType<typeof spyOn>
let debugSpy: ReturnType<typeof spyOn>

beforeEach(() => {
  warnSpy = spyOn(console, 'warn').mockImplementation(() => { /* silence */ })
  errorSpy = spyOn(console, 'error').mockImplementation(() => { /* silence */ })
  infoSpy = spyOn(console, 'info').mockImplementation(() => { /* silence */ })
  debugSpy = spyOn(console, 'debug').mockImplementation(() => { /* silence */ })
  setLogLevel('warn') // default
})
afterEach(() => {
  warnSpy.mockRestore(); errorSpy.mockRestore(); infoSpy.mockRestore(); debugSpy.mockRestore()
  setLogLevel('warn')
})

describe('createLogger', () => {
  it('exposes error/warn/info/debug', () => {
    const l = createLogger('engine')
    for (const m of ['error', 'warn', 'info', 'debug'] as const) {
      expect(typeof l[m]).toBe('function')
    }
  })

  it('prefixes the brand + scope', () => {
    createLogger('engine').warn('boom')
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(String(warnSpy.mock.calls[0][0])).toContain('[prefab:engine]')
    expect(String(warnSpy.mock.calls[0][0])).toContain('boom')
  })

  it('default (no scope) prefixes just the brand', () => {
    log.warn('hello')
    expect(String(warnSpy.mock.calls[0][0])).toBe('[prefab] hello')
  })

  it('forwards extra args (e.g. error objects)', () => {
    const err = new Error('nope')
    log.error('failed', err)
    expect(errorSpy.mock.calls[0][1]).toBe(err)
  })
})

describe('log levels', () => {
  it('default level warn: warn+error fire, info+debug muted', () => {
    log.debug('d'); log.info('i'); log.warn('w'); log.error('e')
    expect(debugSpy).not.toHaveBeenCalled()
    expect(infoSpy).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('silent mutes everything, including error', () => {
    setLogLevel('silent')
    log.warn('w'); log.error('e')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('error level: only error fires', () => {
    setLogLevel('error')
    log.warn('w'); log.error('e')
    expect(warnSpy).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('debug level: everything fires', () => {
    setLogLevel('debug')
    log.debug('d'); log.info('i'); log.warn('w'); log.error('e')
    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('getLogLevel reflects setLogLevel', () => {
    setLogLevel('debug')
    expect(getLogLevel()).toBe('debug')
  })
})
