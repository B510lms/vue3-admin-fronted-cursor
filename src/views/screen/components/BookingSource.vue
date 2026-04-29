<template>
  <div ref="bookingChartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  bookingSource: Array<{ name: string; value: number }>
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const bookingChartRef = ref<HTMLDivElement | null>(null)
let bookingChart: echarts.ECharts | null = null

const renderBookingChart = () => {
  if (!bookingChart) return
  
  bookingChart.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 'center',
      textStyle: { color: '#d8ebff', fontSize: 11 },
      formatter: (name: string) => {
        const target = props.bookingSource.find((item) => item.name === name)
        return `${name}   ${target?.value ?? 0}%`
      },
    },
    color: ['#248bff', '#ffc657', '#7ce7ff', '#ff7f9e', '#9f8cff'],
    series: [
      {
        type: 'pie',
        radius: ['45%', '68%'],
        center: ['72%', '52%'],
        startAngle: 90,
        label: { show: false },
        itemStyle: {
          borderWidth: 6,
          borderColor: '#121f4b',
        },
        data: props.bookingSource,
      },
      {
        type: 'pie',
        radius: ['0%', '34%'],
        center: ['72%', '52%'],
        silent: true,
        label: {
          show: true,
          position: 'center',
          formatter: '预约渠道\n统计',
          color: '#e9f8ff',
          fontSize: 18,
          lineHeight: 28,
          fontWeight: 600,
        },
        data: [{ value: 100, itemStyle: { color: 'rgba(36, 139, 255, 0.18)' } }],
      },
    ],
  })
}

onMounted(() => {
  if (bookingChartRef.value) {
    bookingChart = echarts.init(bookingChartRef.value)
    emit('chartReady', bookingChart)
    renderBookingChart()
  }
})

onBeforeUnmount(() => {
  if (bookingChart) {
    bookingChart.dispose()
    bookingChart = null
  }
})

defineExpose({
  updateChart: renderBookingChart
})
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
}
</style>