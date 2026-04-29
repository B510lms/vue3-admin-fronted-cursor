<template>
  <div class="map-panel">
    <div class="map-panel__title">平台游客增长数量（全年）</div>
    <div ref="mapChartRef" class="chart-container chart-container--map"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  scatterData: Array<{ name: string; value: [number, number, number] }>
  mapData: Array<{ name: string; value: number }>
}>()

const emit = defineEmits<{
  (e: 'chartReady', chart: echarts.ECharts): void
}>()

const mapChartRef = ref<HTMLDivElement | null>(null)
let mapChart: echarts.ECharts | null = null
let chinaMapLoaded = false

const CHINA_GEOJSON_URL =
  'https://raw.githubusercontent.com/zhChuXiao/ChinaGeoJson/master/china.json'

const ensureChinaMap = async () => {
  if (chinaMapLoaded) return true

  try {
    const response = await fetch(CHINA_GEOJSON_URL)
    if (!response.ok) return false

    const geoJson = await response.json()
    echarts.registerMap('china', geoJson)
    chinaMapLoaded = true
    return true
  } catch {
    return false
  }
}

const renderMapChartFallback = () => {
  if (!mapChart) return
  
  const cityPoints = [
    { name: '北京', value: [72, 58, 92] },
    { name: '西安', value: [52, 48, 78] },
    { name: '成都', value: [42, 60, 88] },
    { name: '杭州', value: [73, 71, 80] },
    { name: '广州', value: [65, 86, 74] },
    { name: '乌鲁木齐', value: [18, 32, 58] },
    { name: '哈尔滨', value: [82, 18, 62] },
  ]

  mapChart.setOption({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: {
      min: 0,
      max: 100,
      show: false,
      type: 'value',
    },
    yAxis: {
      min: 0,
      max: 100,
      show: false,
      type: 'value',
      inverse: true,
    },
    graphic: [
      {
        type: 'group',
        left: 'center',
        top: 'middle',
        children: [
          {
            type: 'polygon',
            shape: {
              points: [
                [90, 40],
                [180, 18],
                [325, 32],
                [410, 52],
                [530, 24],
                [670, 66],
                [710, 120],
                [760, 150],
                [740, 220],
                [650, 235],
                [605, 275],
                [580, 325],
                [510, 340],
                [450, 382],
                [405, 360],
                [340, 375],
                [280, 350],
                [210, 362],
                [150, 330],
                [130, 285],
                [82, 242],
                [96, 182],
                [52, 130],
              ],
            },
            style: {
              fill: 'rgba(17, 59, 136, 0.72)',
              stroke: 'rgba(102, 225, 255, 0.85)',
              lineWidth: 2,
              shadowBlur: 35,
              shadowColor: 'rgba(56, 181, 255, 0.25)',
            },
          },
          {
            type: 'polygon',
            shape: {
              points: [
                [645, 245],
                [705, 278],
                [675, 345],
                [620, 325],
              ],
            },
            style: {
              fill: 'rgba(23, 82, 180, 0.52)',
              stroke: 'rgba(102, 225, 255, 0.65)',
              lineWidth: 2,
            },
          },
        ],
      },
    ],
    series: [
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        effect: {
          show: true,
          symbol: 'arrow',
          color: '#8ce8ff',
          symbolSize: 8,
          trailLength: 0,
        },
        lineStyle: {
          color: 'rgba(125, 219, 255, 0.55)',
          width: 1.5,
          curveness: 0.25,
        },
        data: [
          { coords: [[42, 60], [72, 58]] },
          { coords: [[65, 86], [72, 58]] },
          { coords: [[73, 71], [72, 58]] },
          { coords: [[18, 32], [52, 48]] },
          { coords: [[82, 18], [72, 58]] },
        ],
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        rippleEffect: { scale: 4, brushType: 'stroke' },
        symbolSize: (val: number[]) => val[2] / 10,
        itemStyle: {
          color: '#ffd56a',
          shadowBlur: 15,
          shadowColor: 'rgba(255, 213, 106, 0.6)',
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#ecf8ff',
          fontSize: 12,
        },
        data: cityPoints,
      },
    ],
  })
}

const renderMapChart = async () => {
  if (!mapChart) return
  
  const hasChinaMap = await ensureChinaMap()
  if (!hasChinaMap) {
    renderMapChartFallback()
    return
  }

  mapChart.setOption({
    tooltip: {
      trigger: 'item',
    },
    geo: {
      map: 'china',
      roam: true,
      scaleLimit: {
        min: 1,
        max: 4,
      },
      zoom: 1.15,
      top: 20,
      label: {
        show: true,
        color: '#dff6ff',
        fontSize: 10,
      },
      itemStyle: {
        areaColor: '#0d2b63',
        borderColor: '#4bdcff',
        borderWidth: 1.2,
        shadowColor: 'rgba(47, 170, 255, 0.35)',
        shadowBlur: 12,
      },
      emphasis: {
        label: {
          color: '#ffffff',
        },
        itemStyle: {
          areaColor: '#17478f',
        },
      },
      regions: [
        {
          name: '南海诸岛',
          itemStyle: {
            opacity: 0,
          },
          label: {
            show: false,
          },
        },
      ],
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        data: props.mapData,
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        rippleEffect: {
          brushType: 'stroke',
          scale: 4,
        },
        symbolSize: (val: number[]) => Math.max(8, val[2] / 8),
        itemStyle: {
          color: '#ffd36b',
          shadowBlur: 16,
          shadowColor: 'rgba(255, 211, 107, 0.8)',
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          color: '#f7fbff',
          fontSize: 11,
        },
        data: props.scatterData,
      },
      {
        type: 'lines',
        coordinateSystem: 'geo',
        effect: {
          show: true,
          symbol: 'arrow',
          color: '#88eeff',
          symbolSize: 8,
        },
        lineStyle: {
          color: 'rgba(108, 223, 255, 0.6)',
          width: 1.2,
          curveness: 0.2,
        },
        data: [
          { coords: [[104.065735, 30.659462], [116.405285, 39.904989]] },
          { coords: [[113.280637, 23.125178], [116.405285, 39.904989]] },
          { coords: [[121.472644, 31.231706], [116.405285, 39.904989]] },
          { coords: [[108.948024, 34.263161], [116.405285, 39.904989]] },
        ],
      },
    ],
  })
}

onMounted(async () => {
  if (mapChartRef.value) {
    mapChart = echarts.init(mapChartRef.value)
    emit('chartReady', mapChart)
    await renderMapChart()
  }
})

onBeforeUnmount(() => {
  if (mapChart) {
    mapChart.dispose()
    mapChart = null
  }
})

defineExpose({
  updateChart: renderMapChart
})
</script>

<style scoped lang="scss">
.map-panel {
  position: relative;
  height: 100%;
  padding-top: 12px;

  &::before {
    content: '';
    position: absolute;
    inset: 54px 30px 28px;
    border: 1px solid rgba(127, 193, 255, 0.2);
    background:
      linear-gradient(rgba(80, 162, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(80, 162, 255, 0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  &__title {
    position: absolute;
    left: 50%;
    top: 6px;
    transform: translateX(-50%);
    width: 300px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #dff6ff;
    font-size: 14px;
    background: url('@/views/screen/images/map-title-bg.png') no-repeat center center;
    background-size: 100% 100%;
  }
}

.chart-container {
  width: 100%;
  height: 100%;

  &--map {
    position: relative;
    z-index: 1;
    height: calc(100% - 24px);
    margin-top: 18px;
  }
}
</style>