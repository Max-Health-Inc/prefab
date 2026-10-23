import { registerComponent } from '../../engine.js'
import { renderBarChart, renderLineChart } from './cartesian.js'
import { renderPieChart, renderRadarChart, renderRadialChart } from './polar.js'
import { renderHistogram, renderScatterChart } from './scatter.js'

export function registerChartComponents(): void {
  registerComponent('BarChart', renderBarChart)
  registerComponent('LineChart', renderLineChart)
  registerComponent('AreaChart', renderLineChart)
  registerComponent('PieChart', renderPieChart)
  registerComponent('RadarChart', renderRadarChart)
  registerComponent('ScatterChart', renderScatterChart)
  registerComponent('RadialChart', renderRadialChart)
  registerComponent('Histogram', renderHistogram)
}
