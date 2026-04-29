<template>
  <div class="visitor-card">
    <div class="visitor-card__top">
      <div>
        <div class="visitor-card__label">游客实时统计</div>
        <div class="visitor-card__digits">
          <span v-for="(digit, index) in visitorDigits" :key="`${digit}-${index}`">{{ digit }}</span>
        </div>
      </div>
      <div class="visitor-card__unit">人</div>
    </div>
    <div class="visitor-card__ball">
      <div ref="waterRateChartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const props = defineProps<{
  onlineVisitors: number
  waterRate: number
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const visitorDigits = computed(() => String(props.onlineVisitors).padStart(6, '0').split(''))

const waterRateChartRef = ref<HTMLDivElement | null>(null)
let waterRateChart: echarts.ECharts | null = null

const renderWaterRateChart = () => {
  if (!waterRateChart) return
  
  waterRateChart.setOption({
    series: [
      {
        type: 'liquidFill',
        radius: '78%',
        center: ['50%', '52%'],
        data: [
          props.waterRate / 100,
          Math.max(0, (props.waterRate - 8) / 100),
          Math.max(0, (props.waterRate - 16) / 100),
        ],
        color: [
          {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#56f3ff' },
              { offset: 1, color: '#39c2ff' },
            ],
          },
          'rgba(90, 247, 255, 0.72)',
          'rgba(58, 194, 255, 0.42)',
        ],
        outline: {
          show: true,
          borderDistance: 4,
          itemStyle: {
            borderWidth: 4,
            borderColor: '#4fdfff',
            shadowBlur: 16,
            shadowColor: 'rgba(79, 223, 255, 0.4)',
          },
        },
        backgroundStyle: {
          color: 'rgba(12, 37, 85, 0.55)',
          borderWidth: 1,
          borderColor: 'rgba(107, 211, 255, 0.3)',
        },
        label: {
          formatter: `${props.waterRate}%\n预约率`,
          color: '#e9fbff',
          fontSize: 20,
          lineHeight: 28,
          fontWeight: 600,
        },
      },
    ],
    graphic: [
      {
        type: 'circle',
        left: 'center',
        top: 'middle',
        shape: { r: 70 },
        style: {
          stroke: 'rgba(95, 225, 255, 0.22)',
          fill: 'transparent',
          lineWidth: 10,
        },
        silent: true,
      },
    ],
  })
}

onMounted(() => {
  if (waterRateChartRef.value) {
    waterRateChart = echarts.init(waterRateChartRef.value)
    emit('chartReady', waterRateChart)
    renderWaterRateChart()
  }
})

onBeforeUnmount(() => {
  if (waterRateChart) {
    waterRateChart.dispose()
    waterRateChart = null
  }
})

defineExpose({
  updateChart: renderWaterRateChart
})
</script>

<style scoped lang="scss">
.visitor-card {
  height: 100%;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__label {
    color: #d0ebff;
    font-size: 15px;
  }

  &__digits {
    margin-top: 16px;
    display: flex;
    gap: 10px;

    span {
      width: 46px;
      height: 66px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background: url('@/views/screen/images/total.png') no-repeat center center;
      background-size: 100% 100%;
      color: #8ceaff;
      font-size: 40px;
      font-weight: 700;
      text-shadow: 0 0 12px rgba(34, 206, 255, 0.45);
    }
  }

  &__unit {
    color: #b8ddff;
    font-size: 24px;
    padding-left: 12px;
    padding-bottom: 8px;
  }

  &__ball {
    height: 182px;
    margin-top: 8px;
  }
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>