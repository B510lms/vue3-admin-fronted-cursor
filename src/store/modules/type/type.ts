import type { RouteRecordRaw } from 'vue-router'
import type { Category } from '@/api/product/attr/type'
export interface UserState {
  token: string | null
  username: string
  avatar: string
  buttons: string[]
  menuRoutes: RouteRecordRaw[]
}

export interface CategoryState {
  category1Id: number | string
  category1List: Category[]
  category2Id: number | string
  category2List: Category[]
  category3Id: number | string
  category3List: Category[]
}