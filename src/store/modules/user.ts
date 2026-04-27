import { defineStore } from 'pinia'
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'
import type { LoginFormData, LoginResponseData, UserInfoResponseData } from '@/api/user/type'
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import type { UserState } from './type/type'

//引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router'
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

const useUserStore = defineStore('User', {
  state: (): UserState => ({
    token: GET_TOKEN(),
    username: '',
    avatar: '',
    buttons: [],
    menuRoutes: constantRoute,
  }),
  actions: {
    async userLogin(data: LoginFormData) {
      const result: LoginResponseData = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data
        SET_TOKEN(result.data)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async userInfo() {
      const result: UserInfoResponseData = await reqUserInfo()
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons

        // 动态路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        this.menuRoutes = [...constantRoute, ...userAsyncRoute]
          //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加 任意路由放到最后动态追加，避免刷新时提前命中导致跳 404 只有加了这一行才能访问对应的路由否则就跳到404页面
          ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
            router.addRoute(route)
          })
        console.log(this.menuRoutes)

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        this.buttons = []
        this.menuRoutes = constantRoute
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {

  }
})

export default useUserStore
