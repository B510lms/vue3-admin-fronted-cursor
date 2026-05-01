import { defineStore } from 'pinia'
import type { CategoryState } from './type/type'
import { reqCategory1List, reqCategory2List, reqCategory3List } from '@/api/product/attr'
import type { Category, CategoryResponseData } from '@/api/product/attr/type'

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    category1Id: "",
    category1List: [] as Category[],
    category2Id: "",
    category2List: [] as Category[],
    category3Id: "",
    category3List: [] as Category[],
  }),
  actions: {
    async getCategory1List() {
      const result: CategoryResponseData = await reqCategory1List()
      if (result.code == 200) {
        this.category1List = result.data
      }
    },
    async getCategory2List(category1Id: number) {
      const result: CategoryResponseData = await reqCategory2List(category1Id)
      if (result.code == 200) {
        this.category2List = result.data
      }
    },
    async getCategory3List(category2Id: number) {
      const result: CategoryResponseData = await reqCategory3List(category2Id)
      if (result.code == 200) {
        this.category3List = result.data
      }
    }
  },
  getters: {

  }
})

export default useCategoryStore