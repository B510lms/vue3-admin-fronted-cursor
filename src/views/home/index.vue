<template>
  <div class="home-page">
    <el-card class="home-page__card">
      <div class="home-page__profile">
        <img class="home-page__avatar" :src="userStore.avatar" alt="avatar" />
        <div class="home-page__welcome">
          <h1 class="home-page__title">{{ getTime() }}，{{ userStore.username }}</h1>
          <p class="home-page__desc">欢迎来到{{ setting.title }}</p>
        </div>
      </div>
    </el-card>

    <div class="home-page__banner">
      <img class="home-page__banner-img" src="@/assets/icons/welcome.svg" alt="welcome" />
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import getTime from '@/utils/time'
import setting from '@/setting'
const userStore = useUserStore()
</script>

<style scoped lang="scss">
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__card {
    border-radius: 12px;
  }

  &__profile {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &__avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--el-bg-color-overlay);
    background: #fff;
  }

  &__welcome {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__title {
    margin: 0;
    color: var(--app-text-color);
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
  }

  &__desc {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 15px;
    font-style: italic;
  }

  &__banner {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__banner-img {
    width: min(560px, 92%);
    height: auto;
    display: block;
    user-select: none;
  }
}
</style>
