<template>
  <RouterLink class="logo" to="/">
    <img v-if="!setting.logoHidden" class="logo-img" :src="setting.logo" alt="logo" />
    <span v-show="!appStore.sidebarCollapsed" class="logo-title">{{ setting.title }}</span>
  </RouterLink>
</template>

<script setup lang="ts">
import setting from '@/setting'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.logo {
  height: $base-tabbar-height;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: $base-menu-color;
  text-decoration: none;
  user-select: none;

  .logo-img {
    width: 40px;
    height: 40px;
    display: block;
  }

  .logo-title {
    font-size: 20px;
    font-weight: 400;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
