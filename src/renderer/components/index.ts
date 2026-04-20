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
import { registerChartComponents } from './charts.js'
import { registerTableComponents } from './table.js'

let registered = false

export function registerAllComponents(): void {
  if (registered) return
  registered = true

  registerLayoutComponents()
  registerTypographyComponents()
  registerCardComponents()
  registerDataComponents()
  registerFormComponents()
  registerInteractiveComponents()
  registerControlComponents()
  registerAlertComponents()
  registerMediaComponents()
  registerChartComponents()
  registerTableComponents()
}
