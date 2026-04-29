<template>
  <div class="gender-panel">
    <div class="gender-panel__cards">
      <div class="gender-card gender-card--male">
        <span class="gender-card__title">男士</span>
        <img src="@/views/screen/images/man.png" alt="male" />
        <span class="gender-card__value">男士 {{ maleRate }}%</span>
      </div>
      <div class="gender-card gender-card--female">
        <span class="gender-card__title">女士</span>
        <img src="@/views/screen/images/woman.png" alt="female" />
        <span class="gender-card__value">女士 {{ 100 - maleRate }}%</span>
      </div>
    </div>
    <div class="gender-panel__bar">
      <span class="gender-panel__male" :style="{ width: `${maleRate}%` }"></span>
      <span class="gender-panel__female" :style="{ width: `${100 - maleRate}%` }"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  maleRate: number
}>()
</script>

<style scoped lang="scss">
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
</style>