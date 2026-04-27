import router from '@/router'
import NProgress from 'nprogress'
import useUserStore from '@/store/modules/user'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()
  const userStore = useUserStore()
  const token = userStore.token

  if (token) {
    if (to.path === '/login') return '/'
    if (!userStore.username) {
      try {
        await userStore.userInfo()
        return { ...to, replace: true }
      } catch {
        await userStore.userLogout()
        return `/login?redirect=${to.path}`
      }
    }
    return true
  }

  if (to.path === '/login') return true
  return `/login?redirect=${to.path}`
})

router.afterEach((to) => {
  NProgress.done()
  document.title = `${import.meta.env.VITE_APP_TITLE} - ${to.meta.title} `
})
