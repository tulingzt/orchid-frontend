// src/utils/request.ts
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// 请求拦截器 在请求发送前统一处理（如添加 Token）
service.interceptors.request.use(config => {
  const authStore = useAuthStore()
  if (config.url?.endsWith('/auth/refresh')) {
    if (authStore.refreshToken) {
      config.headers.Authorization = `Bearer ${authStore.refreshToken}`
    }
  } 
  else if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

// 响应拦截器 在响应返回后统一处理（如错误处理）
service.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      console.log('[Response Interceptor]', response)
      return response
    }
    console.log('[Response Interceptor]:')
    return Promise.reject(response)
  },
  async error => {
    console.error('[Response Error]', error)
    const authStore = useAuthStore()
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await authStore.refresh()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return service(originalRequest)
      } catch (refreshError) {
        authStore.logout()
        window.location.reload()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default service