import { useEffect, useRef } from 'react'
import { use, init, type EChartsCoreOption } from 'echarts/core'
import { LineChart, BarChart, PieChart, FunnelChart, MapChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent,
  GeoComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  LineChart,
  BarChart,
  PieChart,
  FunnelChart,
  MapChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  VisualMapComponent,
  DatasetComponent,
  GeoComponent,
  CanvasRenderer,
])

interface EChartProps {
  option: EChartsCoreOption
  style?: React.CSSProperties
  onInit?: (chart: any) => void
}

export default function EChart({ option, style, onInit }: EChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current) return
    chartRef.current = init(ref.current)
    chartRef.current.setOption(option)
    onInit?.(chartRef.current)

    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize()
    })
    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
      chartRef.current?.dispose()
    }
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, true)
  }, [option])

  return <div ref={ref} style={{ width: '100%', height: 300, ...style }} />
}
