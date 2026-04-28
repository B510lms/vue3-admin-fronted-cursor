<template>
  <div class="screen-page">
    <header class="screen-page__header">
      <div class="screen-page__title">智慧旅游可视化大数据平台</div>
      <div class="screen-page__time">当前时间：{{ nowTime }}</div>
      <el-button class="screen-page__back" size="small" @click="router.push('/')">返回首页</el-button>
    </header>

    <section class="screen-page__content">
      <aside class="screen-page__col">
        <el-card class="panel">
          <template #header>实时游客统计</template>
          <div class="panel__value">{{ stats.onlineVisitors }} 人</div>
        </el-card>
        <el-card class="panel">
          <template #header>景区水位监测</template>
          <div class="progress-wrap">
            <div class="progress-wrap__label">
              <span>水位占比</span>
              <span>{{ stats.waterRate }}%</span>
            </div>
            <el-progress :percentage="stats.waterRate" :stroke-width="18" />
          </div>
        </el-card>
        <el-card class="panel">
          <template #header>年龄占比</template>
          <div class="age-list">
            <div v-for="item in ageRatio" :key="item.name" class="age-list__item">
              <span>{{ item.name }}</span>
              <el-progress :percentage="item.value" :stroke-width="10" />
            </div>
          </div>
        </el-card>
      </aside>

      <main class="screen-page__center">
        <el-card class="panel panel--map">
          <template #header>全国景区分布</template>
          <div class="map-box">
            <div class="map-box__placeholder">地图模拟区</div>
            <div class="map-box__dot" v-for="n in 12" :key="n" :style="dotStyle(n)"></div>
          </div>
        </el-card>
        <el-card class="panel">
          <template #header>未来七天游客趋势</template>
          <div class="trend">
            <div v-for="(item, idx) in trendData" :key="item.day" class="trend__item">
              <div class="trend__line">
                <div class="trend__line-inner" :style="{ height: `${item.value}%` }"></div>
              </div>
              <span class="trend__label">{{ item.day }}</span>
              <span class="trend__value">{{ trendVisitor[idx] }}</span>
            </div>
          </div>
        </el-card>
      </main>

      <aside class="screen-page__col">
        <el-card class="panel">
          <template #header>热门景区排行</template>
          <div class="rank-list">
            <div class="rank-list__item" v-for="(item, idx) in topSpots" :key="item.name">
              <span>{{ idx + 1 }}. {{ item.name }}</span>
              <span>{{ item.value }} 人</span>
            </div>
          </div>
        </el-card>
        <el-card class="panel">
          <template #header>男女比例</template>
          <div class="gender">
            <div class="gender__item">
              <span>男</span>
              <strong>{{ stats.maleRate }}%</strong>
            </div>
            <div class="gender__item">
              <span>女</span>
              <strong>{{ 100 - stats.maleRate }}%</strong>
            </div>
          </div>
        </el-card>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let timer: number | null = null

const nowTime = computed(() => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const stats = ref({
  onlineVisitors: 99999,
  waterRate: 60,
  maleRate: 58,
})

const topSpots = ref([
  { name: '西湖景区', value: 12800 },
  { name: '黄山风景区', value: 11600 },
  { name: '桂林山水', value: 10320 },
  { name: '张家界', value: 9870 },
  { name: '九寨沟', value: 9240 },
  { name: '鼓浪屿', value: 8620 },
])

const ageRatio = ref([
  { name: '18-25岁', value: 22 },
  { name: '26-35岁', value: 36 },
  { name: '36-45岁', value: 24 },
  { name: '46岁以上', value: 18 },
])

const trendVisitor = ref([5.2, 5.8, 6.1, 6.7, 7.2, 7.8, 8.1])

const trendData = computed(() =>
  ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, idx) => ({
    day,
    value: Math.min(100, Math.round((trendVisitor.value[idx] / 10) * 100)),
  })),
)

const refreshMock = () => {
  stats.value.onlineVisitors = randomInt(90000, 120000)
  stats.value.waterRate = randomInt(45, 90)
  stats.value.maleRate = randomInt(48, 62)
  topSpots.value = topSpots.value
    .map((i) => ({ ...i, value: Math.max(3000, i.value + randomInt(-900, 1200)) }))
    .sort((a, b) => b.value - a.value)
  ageRatio.value = ageRatio.value.map((i) => ({ ...i, value: Math.max(8, i.value + randomInt(-3, 3)) }))
  trendVisitor.value = trendVisitor.value.map((v) => Math.max(3, Math.min(9.5, +(v + (Math.random() - 0.4)).toFixed(1))))
}

const dotStyle = (n: number) => ({
  left: `${8 + ((n * 7) % 78)}%`,
  top: `${12 + ((n * 13) % 72)}%`,
  animationDelay: `${(n % 6) * 0.4}s`,
})

onMounted(() => {
  refreshMock()
  timer = window.setInterval(refreshMock, 2000)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<style scoped lang="scss">
.screen-page {
  position: fixed;
  inset: 0;
  z-index: 2000;
  color: #d8ebff;
  background: radial-gradient(circle at top, #16377f, #081a3a 40%, #050f26 100%);
  padding: 14px;

  &__header {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    border: 1px solid rgba(104, 164, 255, 0.4);
    border-radius: 6px;
    font-weight: 600;
    position: relative;
  }

  &__title {
    letter-spacing: 1px;
    font-size: 18px;
  }

  &__time {
    position: absolute;
    right: 16px;
    color: #8ec5ff;
    font-size: 14px;
  }

  &__back {
    position: absolute;
    left: 12px;
  }

  &__content {
    margin-top: 12px;
    display: grid;
    grid-template-columns: 340px 1fr 340px;
    gap: 12px;
    min-height: calc(100vh - 86px);
  }

  &__col {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 12px;
  }

  &__center {
    display: grid;
    grid-template-rows: 2fr 1fr;
    gap: 12px;
  }
}

.panel {
  height: 100%;
  border: 1px solid rgba(104, 164, 255, 0.35);
  background: rgba(10, 25, 65, 0.75);

  :deep(.el-card__header) {
    color: #8ec5ff;
    border-bottom-color: rgba(104, 164, 255, 0.25);
    padding: 12px 16px;
  }

  :deep(.el-card__body) {
    height: calc(100% - 56px);
    padding: 14px;
  }

  &__value {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    font-weight: 700;
    color: #7cc5ff;
  }

  &--map :deep(.el-card__body) {
    min-height: 360px;
  }
}

.progress-wrap {
  display: grid;
  gap: 10px;

  &__label {
    display: flex;
    justify-content: space-between;
    color: #9ec8ff;
  }
}

.age-list {
  display: grid;
  gap: 12px;

  &__item {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: #a6cfff;
  }
}

.map-box {
  position: relative;
  height: 100%;
  border: 1px dashed rgba(127, 179, 255, 0.35);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(32, 63, 138, 0.3), rgba(8, 20, 46, 0.4));
  overflow: hidden;

  &__placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: #8aa7d8;
    font-size: 20px;
    letter-spacing: 1px;
  }

  &__dot {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #30e8ff;
    box-shadow: 0 0 12px #30e8ff;
    animation: blink 2.2s infinite;
  }
}

.trend {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  align-items: end;

  &__item {
    display: grid;
    gap: 6px;
    justify-items: center;
  }

  &__line {
    width: 100%;
    height: 120px;
    border-radius: 6px;
    background: rgba(112, 158, 255, 0.15);
    display: flex;
    align-items: end;
    overflow: hidden;
  }

  &__line-inner {
    width: 100%;
    background: linear-gradient(180deg, #46e7ff, #2f66ff);
    border-radius: 6px 6px 0 0;
    transition: height 0.35s;
  }

  &__label {
    color: #9ec8ff;
    font-size: 12px;
  }

  &__value {
    color: #76b2ff;
    font-size: 12px;
  }
}

.rank-list {
  display: grid;
  gap: 10px;

  &__item {
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    border: 1px solid rgba(96, 150, 255, 0.25);
    border-radius: 6px;
    color: #a9d1ff;
    font-size: 13px;
    background: rgba(42, 80, 167, 0.18);
  }
}

.gender {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  &__item {
    border: 1px solid rgba(96, 150, 255, 0.25);
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: rgba(42, 80, 167, 0.18);
    color: #acd3ff;
    gap: 8px;
  }

  strong {
    font-size: 26px;
    color: #66c5ff;
  }
}

@keyframes blink {

  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.9);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
</style>
