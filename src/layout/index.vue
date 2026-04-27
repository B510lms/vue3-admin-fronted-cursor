<template>
  <div class="layout-container">
    <aside class="layout-sidebar" :class="{ 'is-collapsed': appStore.sidebarCollapsed }">
      <Logo />
      <Menu />
    </aside>
    <div class="layout-main">
      <Tabbar />
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.layout-container {
  display: flex;
  width: 100%;
  height: 100%;
}

.layout-sidebar {
  width: $base-menu-width;
  height: 100%;
  overflow: hidden;
  background: $base-menu-background;
  color: $base-menu-color;
  transition: width 0.2s ease;

  &.is-collapsed {
    width: $base-menu-collapse-width;
  }
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
