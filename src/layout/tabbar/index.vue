<template>
  <header class="tabbar">
    <div class="tabbar__left">
      <el-button class="tabbar__iconbtn" text @click="appStore.toggleSidebar">
        <el-icon :size="20">
          <component :is="appStore.sidebarCollapsed ? Expand : Fold" />
        </el-icon>
      </el-button>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(m, idx) in breadList" :key="m.path">
          <span v-if="idx === breadList.length - 1" class="crumb-item">
            <el-icon v-if="getCrumbIcon(m.icon)" class="crumb-item__icon">
              <component :is="getCrumbIcon(m.icon)" />
            </el-icon>
            {{ m.title }}
          </span>
          <RouterLink v-else class="crumb-item" :to="m.path">
            <el-icon v-if="getCrumbIcon(m.icon)" class="crumb-item__icon">
              <component :is="getCrumbIcon(m.icon)" />
            </el-icon>
            {{ m.title }}
          </RouterLink>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="tabbar__right">
      <el-tooltip content="刷新" placement="bottom">
        <el-button class="tabbar__iconbtn" text @click="handleRefresh">
          <el-icon :size="18">
            <Refresh />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-tooltip content="全屏" placement="bottom">
        <el-button class="tabbar__iconbtn" text @click="toggleFullscreen">
          <el-icon :size="18">
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-popover trigger="hover" placement="bottom" :width="240" popper-class="theme-popover">
        <template #reference>
          <el-button class="tabbar__iconbtn" text>
            <el-icon :size="18">
              <component :is="appStore.themeMode === 'dark' ? Sunny : Moon" />
            </el-icon>
          </el-button>
        </template>
        <div class="theme-panel">
          <div class="theme-panel__row">
            <span>主题颜色</span>
            <el-color-picker :model-value="appStore.primaryColor" @update:model-value="appStore.setPrimaryColor"
              :teleported="false" />
          </div>
          <div class="theme-panel__row">
            <span>暗黑模式</span>
            <el-switch v-model="isDark" />
          </div>
        </div>
      </el-popover>

      <el-dropdown @command="handleCommand">
        <div class="tabbar__user">
          <el-avatar :size="32" :src="userStore.avatar || undefined">
            {{ (userStore.username || 'A').slice(0, 1) }}
          </el-avatar>
          <span class="tabbar__username">{{ userStore.username || '管理员' }}</span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import { ArrowDown, Expand, Fold, FullScreen, Refresh, Moon, Sunny } from '@element-plus/icons-vue'
import * as ElIcons from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()
const isDark = computed({
  get: () => appStore.themeMode === 'dark',
  set: (val: boolean) => appStore.setThemeMode(val ? 'dark' : 'light'),
})

const breadList = computed(() => {
  const matched = route.matched.filter((r) => r.meta?.title && r.path !== '/login')
  let acc = ''
  return matched.map((r) => {
    const seg = r.path === '' ? '/' : r.path
    if (seg.startsWith('/')) acc = seg
    else acc = `${acc}/${seg}`.replace(/\/+/g, '/')
    return {
      path: acc || '/',
      title: String(r.meta!.title),
      icon: (r.meta?.icon as string | undefined) || '',
    }
  })
})

const getCrumbIcon = (iconName?: string) => {
  if (!iconName) return null
  return (ElIcons as any)[iconName] || null
}

const toggleFullscreen = async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen()
    return
  }
  await document.documentElement.requestFullscreen()
}

const handleRefresh = () => {
  router.go(0)
}

const handleCommand = async (command: any) => {
  if (command !== 'logout') return
  await userStore.userLogout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.tabbar {
  height: $base-tabbar-height;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
  color: var(--app-text-color);

  &__left,
  &__right {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  &__left {
    gap: 8px;
    min-width: 0;
  }

  &__right {
    gap: 8px;
  }

  &__iconbtn {
    padding: 6px 8px;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    padding: 4px 6px;
    border-radius: 6px;
  }

  &__user:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &__username {
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.crumb-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--app-text-color);
  text-decoration: none;

  &__icon {
    font-size: 14px;
  }
}

.crumb-item:hover {
  color: var(--el-color-primary);
}

:deep(.theme-popover) {
  padding: 12px 14px;
}

.theme-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--app-text-color);
    font-size: 13px;
  }
}
</style>
