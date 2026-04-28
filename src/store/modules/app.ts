import { defineStore } from 'pinia'

const THEME_KEY = 'app-theme'
const PRIMARY_KEY = 'app-primary-color'
type ThemeMode = 'light' | 'dark'

const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
}

const applyPrimaryColor = (color: string) => {
  document.documentElement.style.setProperty('--el-color-primary', color)
}

export const useAppStore = defineStore('App', {
  state: () => ({
    sidebarCollapsed: false,
    themeMode: (localStorage.getItem(THEME_KEY) as ThemeMode) || 'light',
    primaryColor: localStorage.getItem(PRIMARY_KEY) || '#409eff',
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    initTheme() {
      applyTheme(this.themeMode)
      applyPrimaryColor(this.primaryColor)
    },
    toggleTheme() {
      this.themeMode = this.themeMode === 'dark' ? 'light' : 'dark'
      localStorage.setItem(THEME_KEY, this.themeMode)
      applyTheme(this.themeMode)
    },
    setThemeMode(mode: ThemeMode) {
      this.themeMode = mode
      localStorage.setItem(THEME_KEY, this.themeMode)
      applyTheme(this.themeMode)
    },
    setPrimaryColor(color: string | null) {
      const next = color || '#409eff'
      this.primaryColor = next
      localStorage.setItem(PRIMARY_KEY, next)
      applyPrimaryColor(next)
    },
  },
})

