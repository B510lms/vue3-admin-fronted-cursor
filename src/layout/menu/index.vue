<template>
  <el-menu
    class="menu"
    router
    :default-active="activePath"
    :default-openeds="defaultOpeneds"
    background-color="#001529"
    text-color="#fff"
    active-text-color="#ffd04b"
    :collapse="appStore.sidebarCollapsed"
    :collapse-transition="false"
  >
    <MenuTree :menus="menuList" />
  </el-menu>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, resolveComponent } from 'vue'
import type { PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user'
import { useAppStore } from '@/store/modules/app'
import * as ElIcons from '@element-plus/icons-vue'

const userStore = useUserStore()
const appStore = useAppStore()
const route = useRoute()

const activePath = computed(() => route.path)

const menuList = computed(() =>
  userStore.menuRoutes
    .filter((route) => !['/login', '/404', '/:pathMatch(.*)*'].includes(route.path))
    .flatMap((route) => (route.path === '/' && route.children ? route.children : [route])),
)

const collectOpeneds = (menus: RouteRecordRaw[], basePath = ''): string[] => {
  const result: string[] = []
  menus.forEach((item) => {
    const currentPath = item.path.startsWith('/')
      ? item.path
      : `${basePath}/${item.path}`.replace(/\/+/g, '/')
    if (item.children && item.children.length > 0) {
      result.push(currentPath)
      result.push(...collectOpeneds(item.children as RouteRecordRaw[], currentPath))
    }
  })
  return result
}

const defaultOpeneds = computed(() => collectOpeneds(menuList.value))

const MenuTree = defineComponent({
  name: 'MenuTree',
  props: {
    menus: { type: Array as PropType<RouteRecordRaw[]>, required: true },
    basePath: { type: String, default: '' },
  },
  setup(props) {
    const resolvePath = (path: string) => {
      if (path.startsWith('/')) return path
      const base = props.basePath || ''
      return `${base}/${path}`.replace(/\/+/g, '/')
    }

    return () => {
      const ElSubMenu = resolveComponent('ElSubMenu') as any
      const ElMenuItem = resolveComponent('ElMenuItem') as any
      const ElIcon = resolveComponent('ElIcon') as any

      return props.menus.map((item) => {
        const iconName = item.meta?.icon as string | undefined
        const IconComp = iconName ? (ElIcons as any)[iconName] : undefined
        const icon = IconComp ? h(ElIcon, null, { default: () => h(IconComp) }) : null

        const titleText = (item.meta?.title as string) || (item.name as string) || ''
        const index = resolvePath(item.path)

        if (item.children && item.children.length > 0) {
          return h(
            ElSubMenu,
            { index, key: index },
            {
              title: () => [icon, h('span', null, titleText)],
              default: () =>
                h(MenuTree, {
                  menus: item.children as RouteRecordRaw[],
                  basePath: index,
                }),
            },
          )
        }

        return h(
          ElMenuItem,
          { index, key: index },
          {
            default: () => [icon, h('span', null, titleText)],
          },
        )
      })
    }
  },
})
</script>

<style scoped lang="scss">
.menu {
  border-right: none !important;
}
</style>
