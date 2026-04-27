import type { RouteRecordRaw } from 'vue-router'

export interface UserState {
  token: string | null
  username: string
  avatar: string
  buttons: string[]
  menuRoutes: RouteRecordRaw[]
}