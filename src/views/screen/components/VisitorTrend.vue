<template>
  <div ref="trendChartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  trendVisitor: number[]
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const trendChartRef = ref<HTMLDivElement | null>(null)
let trendChart: echarts.ECharts | null = null

const renderTrendChart = () => {
  if (!trendChart) return
  
  trendChart.setOption({
    grid: {
      left: 36,
      right: 20,
      top: 28,
      bottom: 28,
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['05/03', '05/06', '05/09', '05/12', '05/16', '05/20', '05/23', '05/26', '05/30', '06/03', '06/06', '06/10'],
      axisLine: { lineStyle: { color: 'rgba(127, 197, 255, 0.45)' } },
      axisLabel: { color: '#b8dcff', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      axisLabel: { color: '#b8dcff', fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(110, 169, 255, 0.18)' } },
    },
    series: [
      {
        data: props.trendVisitor,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#ffcf59',
        },
        itemStyle: {
          color: '#ffcf59',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 207, 89, 0.32)' },
            { offset: 1, color: 'rgba(255, 207, 89, 0.02)' },
          ]),
        },
      },
    ],
  })
}

onMounted(() => {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    emit('chartReady', trendChart)
    renderTrendChart()
  }
})

onBeforeUnmount(() => {
  if (trendChart) {
    trendChart.dispose()
    trendChart = null
  }
})

defineExpose({
  updateChart: renderTrendChart
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
}
</style>