/**
 * Register all built-in component renderers.
 */

import { registerLayoutComponents } from './layout.js'
import { registerTypographyComponents } from './typography.js'
import { registerCardComponents } from './card.js'
import { registerDataComponents } from './data.js'
import { registerFormComponents } from './form.js'
import { registerInteractiveComponents } from './interactive.js'
import { registerControlComponents } from './control.js'
import { registerAlertComponents } from './alert.js'
import { registerMediaComponents } from './media.js'
import { registerPdfComponents } from './pdf.js'
import { registerChartComponents } from './charts.js'
import { registerTableComponents } from './table.js'
import { registeredComponentTypes, setBuiltinComponentTypes } from '../engine.js'

let registered = false

export function registerAllComponents(): void {
  if (registered) return
  registered = true

  // The built-in set is the delta these registrars add, rather than whatever the
  // registry holds afterwards: a caller may have registered its own components
  // first, and those are not built-ins.
  const before = new Set(registeredComponentTypes())

  registerLayoutComponents()
  registerTypographyComponents()
  registerCardComponents()
  registerDataComponents()
  registerFormComponents()
  registerInteractiveComponents()
  registerControlComponents()
  registerAlertComponents()
  registerMediaComponents()
  registerPdfComponents()
  registerChartComponents()
  registerTableComponents()

  setBuiltinComponentTypes(registeredComponentTypes().filter(t => !before.has(t)))
}
