<template>
  <div class="screen-shell">
    <div class="screen-canvas" :style="canvasStyle">
      <div class="screen-page">
        <header class="screen-header">
          <button class="screen-header__btn screen-header__btn--left" @click="router.push('/')">首页</button>
          <div class="screen-header__side screen-header__side--left"></div>
          <div class="screen-header__center">
            <h1>智慧旅游可视化大数据展示平台</h1>
            <div class="screen-header__sub">统计概览</div>
          </div>
          <div class="screen-header__side screen-header__side--right"></div>
          <div class="screen-header__info">
            <span>当前时间 {{ nowTime }}</span>
          </div>
        </header>

        <section class="screen-body">
          <aside class="screen-column screen-column--left">
            <section class="panel panel--left-top">
              <div class="panel__title">实时游客统计</div>
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
            </section>

            <section class="panel panel--left-center">
              <div class="panel__title">男女比例</div>
              <div class="gender-panel">
                <div class="gender-panel__cards">
                  <div class="gender-card gender-card--male">
                    <span class="gender-card__title">男士</span>
                    <img src="@/views/screen/images/man.png" alt="male" />
                    <span class="gender-card__value">男士 {{ stats.maleRate }}%</span>
                  </div>
                  <div class="gender-card gender-card--female">
                    <span class="gender-card__title">女士</span>
                    <img src="@/views/screen/images/woman.png" alt="female" />
                    <span class="gender-card__value">女士 {{ 100 - stats.maleRate }}%</span>
                  </div>
                </div>
                <div class="gender-panel__bar">
                  <span class="gender-panel__male" :style="{ width: `${stats.maleRate}%` }"></span>
                  <span class="gender-panel__female" :style="{ width: `${100 - stats.maleRate}%` }"></span>
                </div>
              </div>
            </section>

            <section class="panel panel--left-bottom">
              <div class="panel__title">年龄比例</div>
              <div ref="ageRatioChartRef" class="chart-container"></div>
            </section>
          </aside>

          <main class="screen-center">
            <section class="panel panel--center-map">
              <div class="panel__title panel__title--center">平台游客地域分布</div>
              <div class="map-panel">
                <div class="map-panel__title">平台游客增长数量（全年）</div>
                <div ref="mapChartRef" class="chart-container chart-container--map"></div>
              </div>
            </section>

            <section class="panel panel--center-bottom">
              <div class="panel__title">未来30天游客量趋势图</div>
              <div ref="trendChartRef" class="chart-container"></div>
            </section>
          </main>

          <aside class="screen-column screen-column--right">
            <section class="panel panel--right-top">
              <div class="panel__title">热门景区排行</div>
              <div ref="topSpotsChartRef" class="chart-container"></div>
            </section>

            <section class="panel panel--right-center">
              <div class="panel__title">年度游客量对比</div>
              <div ref="annualTrendChartRef" class="chart-container"></div>
            </section>

            <section class="panel panel--right-bottom">
              <div class="panel__title">预约渠道数据统计</div>
              <div ref="bookingChartRef" class="chart-container"></div>
            </section>
          </aside>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

const router = useRouter()

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

const canvasStyle = ref<Record<string, string>>({})
const nowTime = ref('')
let clockTimer: number | null = null
let dataTimer: number | null = null

const formatNow = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const stats = ref({
  onlineVisitors: 216908,
  waterRate: 68,
  maleRate: 58,
})

const topSpots = ref([
  { name: '峨眉山', value: 80000 },
  { name: '九寨沟', value: 60000 },
  { name: '万里长城', value: 50000 },
  { name: '北京故宫', value: 40000 },
  { name: '苏州园林', value: 30000 },
])

const ageRatio = ref([
  { name: '18以下', value: 10 },
  { name: '18-30岁', value: 14 },
  { name: '30-50岁', value: 24 },
  { name: '50岁以上', value: 20 },
  { name: '未知', value: 20 },
])

const trendVisitor = ref([0.9, 1.1, 1.0, 0.8, 1.25, 0.75, 1.3, 1.2, 0.95, 1.4, 1.15, 1.35])
const annualVisitors = ref({
  year2021: [320, 260, 180, 220, 540, 180, 320, 210, 520, 390, 180, 470],
  year2022: [260, 140, 420, 260, 120, 480, 260, 200, 380, 180, 430, 260],
  year2023: [420, 240, 120, 520, 260, 360, 140, 460, 220, 120, 520, 300],
})

const bookingSource = ref([
  { name: '美团', value: 42 },
  { name: '携程', value: 18 },
  { name: '飞猪', value: 20 },
  { name: '去哪儿', value: 10 },
  { name: '其他渠道', value: 10 },
])

const visitorDigits = computed(() => String(stats.value.onlineVisitors).padStart(6, '0').split(''))

const waterRateChartRef = ref<HTMLDivElement | null>(null)
const ageRatioChartRef = ref<HTMLDivElement | null>(null)
const mapChartRef = ref<HTMLDivElement | null>(null)
const trendChartRef = ref<HTMLDivElement | null>(null)
const topSpotsChartRef = ref<HTMLDivElement | null>(null)
const annualTrendChartRef = ref<HTMLDivElement | null>(null)
const bookingChartRef = ref<HTMLDivElement | null>(null)

let waterRateChart: echarts.ECharts | null = null
let ageRatioChart: echarts.ECharts | null = null
let mapChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null
let topSpotsChart: echarts.ECharts | null = null
let annualTrendChart: echarts.ECharts | null = null
let bookingChart: echarts.ECharts | null = null
let chinaMapLoaded = false

const CHINA_GEOJSON_URL =
  'https://raw.githubusercontent.com/zhChuXiao/ChinaGeoJson/master/china.json'

const chartInstances = () =>
  [waterRateChart, ageRatioChart, mapChart, trendChart, topSpotsChart, annualTrendChart, bookingChart].filter(
    Boolean,
  ) as echarts.ECharts[]

const updateScale = () => {
  const scale = Math.min(window.innerWidth / DESIGN_WIDTH, window.innerHeight / DESIGN_HEIGHT)
  const width = DESIGN_WIDTH * scale
  const height = DESIGN_HEIGHT * scale
  const translateX = (window.innerWidth - width) / 2
  const translateY = (window.innerHeight - height) / 2

  canvasStyle.value = {
    width: `${DESIGN_WIDTH}px`,
    height: `${DESIGN_HEIGHT}px`,
    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
  }

  requestAnimationFrame(() => {
    chartInstances().forEach((chart) => chart.resize())
  })
}

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

const renderWaterRateChart = () => {
  waterRateChart?.setOption({
    series: [
      {
        type: 'liquidFill',
        radius: '78%',
        center: ['50%', '52%'],
        data: [
          stats.value.waterRate / 100,
          Math.max(0, (stats.value.waterRate - 8) / 100),
          Math.max(0, (stats.value.waterRate - 16) / 100),
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
          formatter: `${stats.value.waterRate}%\n预约率`,
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

const renderMapChartFallback = () => {
  const cityPoints = [
    { name: '北京', value: [72, 58, 92] },
    { name: '西安', value: [52, 48, 78] },
    { name: '成都', value: [42, 60, 88] },
    { name: '杭州', value: [73, 71, 80] },
    { name: '广州', value: [65, 86, 74] },
    { name: '乌鲁木齐', value: [18, 32, 58] },
    { name: '哈尔滨', value: [82, 18, 62] },
  ]

  mapChart?.setOption({
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

const renderAgeRatioChart = () => {
  ageRatioChart?.setOption({
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
        data: ageRatio.value,
      },
    ],
  })
}

const renderMapChart = async () => {
  const hasChinaMap = await ensureChinaMap()
  if (!hasChinaMap) {
    renderMapChartFallback()
    return
  }

  const scatterData = [
    { name: '北京', value: [116.405285, 39.904989, 92] },
    { name: '上海', value: [121.472644, 31.231706, 88] },
    { name: '成都', value: [104.065735, 30.659462, 75] },
    { name: '广州', value: [113.280637, 23.125178, 70] },
    { name: '西安', value: [108.948024, 34.263161, 64] },
    { name: '乌鲁木齐', value: [87.617733, 43.792818, 52] },
  ]

  mapChart?.setOption({
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
        data: [
          { name: '四川', value: 92 },
          { name: '广东', value: 82 },
          { name: '浙江', value: 78 },
          { name: '北京', value: 66 },
          { name: '上海', value: 72 },
          { name: '陕西', value: 64 },
          { name: '新疆', value: 50 },
          { name: '黑龙江', value: 48 },
        ],
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
        data: scatterData,
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

const renderTrendChart = () => {
  trendChart?.setOption({
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
        data: trendVisitor.value,
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

const renderTopSpotsChart = () => {
  const names = topSpots.value.map((item) => item.name)
  const values = topSpots.value.map((item) => item.value)

  topSpotsChart?.setOption({
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

const renderAnnualTrendChart = () => {
  annualTrendChart?.setOption({
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
      { name: '2021年', type: 'line', smooth: true, data: annualVisitors.value.year2021, areaStyle: { opacity: 0.12 } },
      { name: '2022年', type: 'line', smooth: true, data: annualVisitors.value.year2022, areaStyle: { opacity: 0.12 } },
      { name: '2023年', type: 'line', smooth: true, data: annualVisitors.value.year2023, areaStyle: { opacity: 0.12 } },
    ],
  })
}

const renderBookingChart = () => {
  bookingChart?.setOption({
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 'center',
      textStyle: { color: '#d8ebff', fontSize: 11 },
      formatter: (name: string) => {
        const target = bookingSource.value.find((item) => item.name === name)
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
        data: bookingSource.value,
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

const renderAllCharts = () => {
  renderWaterRateChart()
  renderAgeRatioChart()
  void renderMapChart()
  renderTrendChart()
  renderTopSpotsChart()
  renderAnnualTrendChart()
  renderBookingChart()
}

const initCharts = async () => {
  await nextTick()

  if (waterRateChartRef.value && !waterRateChart) waterRateChart = echarts.init(waterRateChartRef.value)
  if (ageRatioChartRef.value && !ageRatioChart) ageRatioChart = echarts.init(ageRatioChartRef.value)
  if (mapChartRef.value && !mapChart) mapChart = echarts.init(mapChartRef.value)
  if (trendChartRef.value && !trendChart) trendChart = echarts.init(trendChartRef.value)
  if (topSpotsChartRef.value && !topSpotsChart) topSpotsChart = echarts.init(topSpotsChartRef.value)
  if (annualTrendChartRef.value && !annualTrendChart)
    annualTrendChart = echarts.init(annualTrendChartRef.value)
  if (bookingChartRef.value && !bookingChart) bookingChart = echarts.init(bookingChartRef.value)

  renderAllCharts()
}

const refreshMock = () => {
  stats.value.onlineVisitors = randomInt(210000, 219999)
  stats.value.waterRate = randomInt(56, 86)
  stats.value.maleRate = randomInt(52, 61)

  topSpots.value = topSpots.value
    .map((item) => ({ ...item, value: Math.max(20000, item.value + randomInt(-9000, 8000)) }))
    .sort((a, b) => b.value - a.value)

  const ageBase = [
    randomInt(8, 13),
    randomInt(10, 18),
    randomInt(20, 28),
    randomInt(16, 24),
    randomInt(10, 22),
  ]
  const total = ageBase.reduce((sum, value) => sum + value, 0)
  ageRatio.value = [
    { name: '18以下', value: Math.round((ageBase[0] / total) * 100) },
    { name: '18-30岁', value: Math.round((ageBase[1] / total) * 100) },
    { name: '30-50岁', value: Math.round((ageBase[2] / total) * 100) },
    { name: '50岁以上', value: Math.round((ageBase[3] / total) * 100) },
    { name: '未知', value: Math.max(1, 100 - Math.round((ageBase[0] / total) * 100) - Math.round((ageBase[1] / total) * 100) - Math.round((ageBase[2] / total) * 100) - Math.round((ageBase[3] / total) * 100)) },
  ]

  trendVisitor.value = trendVisitor.value.map((value) =>
    Math.max(0.6, Math.min(1.6, Number((value + (Math.random() - 0.5) * 0.25).toFixed(2)))),
  )

  annualVisitors.value = {
    year2021: annualVisitors.value.year2021.map((value) => Math.max(80, value + randomInt(-55, 60))),
    year2022: annualVisitors.value.year2022.map((value) => Math.max(80, value + randomInt(-55, 60))),
    year2023: annualVisitors.value.year2023.map((value) => Math.max(80, value + randomInt(-55, 60))),
  }

  const bookingRaw = bookingSource.value.map((item) => ({
    ...item,
    value: Math.max(6, item.value + randomInt(-4, 4)),
  }))
  const bookingTotal = bookingRaw.reduce((sum, item) => sum + item.value, 0)
  bookingSource.value = bookingRaw.map((item, index) => {
    if (index === bookingRaw.length - 1) {
      const used = bookingRaw
        .slice(0, -1)
        .reduce((sum, current) => sum + Math.round((current.value / bookingTotal) * 100), 0)
      return { ...item, value: 100 - used }
    }
    return { ...item, value: Math.round((item.value / bookingTotal) * 100) }
  })

  renderAllCharts()
}

const handleResize = () => updateScale()

onMounted(async () => {
  nowTime.value = formatNow()
  clockTimer = window.setInterval(() => {
    nowTime.value = formatNow()
  }, 1000)

  updateScale()
  await initCharts()
  refreshMock()

  dataTimer = window.setInterval(refreshMock, 3000)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (clockTimer) window.clearInterval(clockTimer)
  if (dataTimer) window.clearInterval(dataTimer)

  window.removeEventListener('resize', handleResize)

  chartInstances().forEach((chart) => chart.dispose())
  waterRateChart = null
  ageRatioChart = null
  mapChart = null
  trendChart = null
  topSpotsChart = null
  annualTrendChart = null
  bookingChart = null
})
</script>

<style scoped lang="scss">
.screen-shell {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at center, rgba(37, 102, 211, 0.18), transparent 42%),
    #050b1c url('@/views/screen/images/bg.png') no-repeat center center;
  background-size: cover;
}

.screen-canvas {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: left top;
}

.screen-page {
  width: 1920px;
  height: 1080px;
  padding: 18px 28px 18px;
  color: #d7ecff;
  box-sizing: border-box;
}

.screen-header {
  position: relative;
  display: grid;
  grid-template-columns: 176px 1fr 680px 1fr 320px;
  align-items: start;
  gap: 16px;
  height: 86px;

  &__side {
    height: 34px;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    &--left {
      background-image: url('@/views/screen/images/dataScreen-header-left-bg.png');
    }

    &--right {
      background-image: url('@/views/screen/images/dataScreen-header-right-bg.png');
    }
  }

  &__center {
    height: 76px;
    padding-top: 8px;
    background: url('@/views/screen/images/dataScreen-header-center-bg.png') no-repeat center top;
    background-size: 100% 100%;
    text-align: center;

    h1 {
      margin: 0;
      font-size: 34px;
      line-height: 42px;
      color: #7ee6ff;
      letter-spacing: 3px;
      text-shadow: 0 0 18px rgba(55, 200, 255, 0.55);
    }
  }

  &__sub {
    margin-top: 2px;
    color: #8fc9ff;
    font-size: 14px;
    letter-spacing: 8px;
  }

  &__btn {
    width: 136px;
    height: 42px;
    margin-top: 6px;
    border: 0;
    color: #baf4ff;
    font-size: 18px;
    cursor: pointer;
    background-color: transparent;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    &--left {
      justify-self: start;
      background-image: url('@/views/screen/images/dataScreen-header-btn-bg-l.png');
    }
  }

  &__info {
    height: 42px;
    margin-top: 5px;
    padding-right: 12px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #8bc7ff;
    font-size: 18px;
    background: url('@/views/screen/images/dataScreen-header-warn-bg.png') no-repeat center center;
    background-size: 100% 100%;
  }
}

.screen-body {
  margin-top: 6px;
  height: calc(100% - 92px);
  display: grid;
  grid-template-columns: 392px 1fr 392px;
  gap: 22px;
}

.screen-column {
  display: grid;
  gap: 18px;

  &--left {
    grid-template-rows: 356px 214px 1fr;
  }

  &--right {
    grid-template-rows: 295px 276px 1fr;
  }
}

.screen-center {
  display: grid;
  grid-template-rows: 1fr 248px;
  gap: 18px;
}

.panel {
  position: relative;
  padding: 50px 18px 16px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  box-sizing: border-box;

  &--left-top {
    background-image: url('@/views/screen/images/dataScreen-main-lt.png');
  }

  &--left-center {
    background-image: url('@/views/screen/images/dataScreen-main-lc.png');
  }

  &--left-bottom {
    background-image: url('@/views/screen/images/dataScreen-main-lb.png');
  }

  &--center-map {
    background-image: url('@/views/screen/images/dataScreen-main-cb.png');
  }

  &--center-bottom {
    background-image: url('@/views/screen/images/dataScreen-main-cb.png');
  }

  &--right-top {
    background-image: url('@/views/screen/images/dataScreen-main-rt.png');
  }

  &--right-center {
    background-image: url('@/views/screen/images/dataScreen-main-rc.png');
  }

  &--right-bottom {
    background-image: url('@/views/screen/images/dataScreen-main-rb.png');
  }

  &__title {
    position: absolute;
    left: 14px;
    top: 14px;
    min-width: 208px;
    height: 32px;
    padding: 0 26px 0 18px;
    display: inline-flex;
    align-items: center;
    background: url('@/views/screen/images/map-title-bg.png') no-repeat left center;
    background-size: 100% 100%;
    color: #dff6ff;
    font-size: 20px;
    letter-spacing: 1px;

    &--center {
      left: 50%;
      top: 20px;
      transform: translateX(-50%);
      justify-content: center;
      width: 280px;
    }
  }
}

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

.gender-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__bar {
    height: 12px;
    border-radius: 999px;
    overflow: hidden;
    display: flex;
    background: rgba(26, 58, 120, 0.65);
    box-shadow: inset 0 0 0 1px rgba(118, 190, 255, 0.25);
  }

  &__male {
    background: linear-gradient(90deg, #1f7cff, #38d2ff);
  }

  &__female {
    background: linear-gradient(90deg, #ff6a90, #ff4bc5);
  }
}

.gender-card {
  height: 128px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;

  img {
    width: 58px;
    height: 58px;
    object-fit: contain;
    margin-top: 10px;
  }

  &__title {
    color: #eaf8ff;
    font-size: 16px;
  }

  &__value {
    margin-top: 12px;
    font-size: 14px;
    color: #d9eeff;
  }

  &--male {
    background-image: url('@/views/screen/images/man-bg.png');
  }

  &--female {
    background-image: url('@/views/screen/images/woman-bg.png');
  }
}

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