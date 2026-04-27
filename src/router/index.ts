import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

export default router

export const resetRouter = () => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !['login', 'home', '404', 'any'].includes(String(name))) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
