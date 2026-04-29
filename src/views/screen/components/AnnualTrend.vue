<template>
  <div ref="annualTrendChartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  annualVisitors: {
    year2021: number[]
    year2022: number[]
    year2023: number[]
  }
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const annualTrendChartRef = ref<HTMLDivElement | null>(null)
let annualTrendChart: echarts.ECharts | null = null

const renderAnnualTrendChart = () => {
  if (!annualTrendChart) return
  
  annualTrendChart.setOption({
    color: ['#2f8cff', '#ff8c66', '#6bd0ff'],
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: '#d9edff', fontSize: 11 },
    },
    grid: {
      left: 32,
      right: 16,
      top: 34,
      bottom: 22,
    },
    xAxis: {
      type: 'category',
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      axisLine: { lineStyle: { color: 'rgba(127, 197, 255, 0.45)' } },
      axisLabel: { color: '#b8dcff' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#b8dcff' },
      splitLine: { lineStyle: { color: 'rgba(110, 169, 255, 0.16)' } },
    },
    series: [
      { name: '2021年', type: 'line', smooth: true, data: props.annualVisitors.year2021, areaStyle: { opacity: 0.12 } },
      { name: '2022年', type: 'line', smooth: true, data: props.annualVisitors.year2022, areaStyle: { opacity: 0.12 } },
      { name: '2023年', type: 'line', smooth: true, data: props.annualVisitors.year2023, areaStyle: { opacity: 0.12 } },
    ],
  })
}

onMounted(() => {
  if (annualTrendChartRef.value) {
    annualTrendChart = echarts.init(annualTrendChartRef.value)
    emit('chartReady', annualTrendChart)
    renderAnnualTrendChart()
  }
})

onBeforeUnmount(() => {
  if (annualTrendChart) {
    annualTrendChart.dispose()
    annualTrendChart = null
  }
})

defineExpose({
  updateChart: renderAnnualTrendChart
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
}
</style>