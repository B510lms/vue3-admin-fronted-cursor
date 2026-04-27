import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
    config.headers.token = userStore.token
  }
  return config
})

request.interceptors.response.use((response) => {
  const data = response.data
  if (typeof data?.code === 'number' && data.code !== 200) {
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(data)
  }
  return data
}, (error) => {
  ElMessage.error(error.response?.data?.message || '请求失败，请稍后重试')
  return Promise.reject(error)
})

export default request
