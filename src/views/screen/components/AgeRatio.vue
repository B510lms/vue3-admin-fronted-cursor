<template>
  <div ref="ageRatioChartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  ageRatio: Array<{ name: string; value: number }>
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const ageRatioChartRef = ref<HTMLDivElement | null>(null)
let ageRatioChart: echarts.ECharts | null = null

const renderAgeRatioChart = () => {
  if (!ageRatioChart) return
  
  ageRatioChart.setOption({
    color: ['#37c8ff', '#4b74ff', '#ffb84d', '#9c7bff', '#ff5d95'],
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: '#bddcff',
        fontSize: 11,
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['28%', '62%'],
        center: ['50%', '44%'],
        label: {
          color: '#e3f4ff',
          formatter: '{d}%',
          fontSize: 11,
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(167, 215, 255, 0.55)',
          },
        },
        itemStyle: {
          borderColor: '#0d1840',
          borderWidth: 3,
        },
        data: props.ageRatio,
      },
    ],
  })
}

onMounted(() => {
  if (ageRatioChartRef.value) {
    ageRatioChart = echarts.init(ageRatioChartRef.value)
    emit('chartReady', ageRatioChart)
    renderAgeRatioChart()
  }
})

onBeforeUnmount(() => {
  if (ageRatioChart) {
    ageRatioChart.dispose()
    ageRatioChart = null
  }
})

defineExpose({
  updateChart: renderAgeRatioChart
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
}
</style>