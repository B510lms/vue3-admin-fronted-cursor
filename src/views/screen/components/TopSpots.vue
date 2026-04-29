<template>
  <div ref="topSpotsChartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  topSpots: Array<{ name: string; value: number }>
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const topSpotsChartRef = ref<HTMLDivElement | null>(null)
let topSpotsChart: echarts.ECharts | null = null

const renderTopSpotsChart = () => {
  if (!topSpotsChart) return
  
  const names = props.topSpots.map((item) => item.name)
  const values = props.topSpots.map((item) => item.value)

  topSpotsChart.setOption({
    grid: {
      left: 72,
      right: 24,
      top: 18,
      bottom: 18,
    },
    xAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: {
        color: '#b8dcff',
        formatter: (value: number) => `${value / 10000}w`,
      },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: names,
      inverse: true,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#e4f3ff', fontSize: 12 },
    },
    series: [
      {
        type: 'bar',
        data: values,
        barWidth: 10,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(41, 83, 166, 0.45)',
        },
        itemStyle: {
          borderRadius: [0, 10, 10, 0],
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#34d0ff' },
            { offset: 1, color: '#6d7bff' },
          ]),
        },
        label: {
          show: true,
          position: 'right',
          color: '#ffd77f',
          formatter: ({ value }: { value: number }) => `${(value / 10000).toFixed(2)}w`,
        },
      },
    ],
  })
}

onMounted(() => {
  if (topSpotsChartRef.value) {
    topSpotsChart = echarts.init(topSpotsChartRef.value)
    emit('chartReady', topSpotsChart)
    renderTopSpotsChart()
  }
})

onBeforeUnmount(() => {
  if (topSpotsChart) {
    topSpotsChart.dispose()
    topSpotsChart = null
  }
})

defineExpose({
  updateChart: renderTopSpotsChart
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
}
</style>