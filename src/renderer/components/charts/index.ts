import { registerComponent } from '../../engine.js'
import { renderBarChart, renderLineChart } from './cartesian.js'
import { renderPieChart, renderRadarChart, renderRadialChart } from './polar.js'
import { responsiveChart } from './helpers.js'
import { renderHistogram, renderScatterChart } from './scatter.js'

export function registerChartComponents(): void {
  registerComponent('BarChart', responsiveChart(renderBarChart))
  registerComponent('LineChart', responsiveChart(renderLineChart))
  registerComponent('AreaChart', responsiveChart(renderLineChart))
  registerComponent('PieChart', renderPieChart)
  registerComponent('RadarChart', renderRadarChart)
  registerComponent('ScatterChart', responsiveChart(renderScatterChart))
  registerComponent('RadialChart', renderRadialChart)
  registerComponent('Histogram', responsiveChart(renderHistogram))
}
