// src/stores/auth.ts
import { defineStore } from 'pinia'
import { authAPI } from '@/api/auth'
import type { User, LoginRequest, UserRole } from '@/types/models'

type JwtPayload = {
  id: number
  name: string
  role: UserRole
}

const parseJwt = (token: string): JwtPayload => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const rawPayload = atob(base64)
    const uriEncoded = Array.from(rawPayload).map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
    return JSON.parse(decodeURIComponent(uriEncoded))
  } catch (e) {
    throw new Error('Invalid token format')
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') as User | null,
    loading: false
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
    isAdmin: state => state.userInfo?.role === 'admin',
    currentUser: state => state.userInfo
  },

  actions: {
    async login(credentials: LoginRequest) {
      try {
        this.loading = true
        const data = await authAPI.login(credentials)
        // 解析并存储用户信息
        const payload = parseJwt(data.access_token.toString())
        this.userInfo = {
          user_id: payload.id,
          username: payload.name,
          role: payload.role
        }
        // 更新 token 存储
        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token
        // 持久化存储
        localStorage.setItem('accessToken', data.access_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      } finally {
        this.loading = false
      }
    },

    async refresh() {
      if (!this.refreshToken) throw new Error('No refresh token')
      try {
        const data = await authAPI.refreshToken()
        console.log(data)
        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token
        localStorage.setItem('accessToken', data.access_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        return data.access_token
      } catch (error) {
        this.logout()
        throw error
      }
    },

    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.userInfo = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
    },
  }
})