// src/stores/user.ts
import { defineStore } from 'pinia'
import { authAPI } from '@/api/auth'
import type { User, UserRole, UserQueryParams } from '@/types/models'

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [] as User[],
    userPagination: {
      total: 0,
      page: 1,
      pages: 0,
      per_page: 0
    },
    loading: false
  }),

  actions: {
    async createUser(data: {
      username: string
      password: string
      admin_secret?: string
    }) {
      try {
        await authAPI.register({
          username: data.username,
          password: data.password,
          admin_secret: data.admin_secret
        })
        await this.fetchUsers()
      } catch (err) {
        throw new Error((err as Error).message)
      }
    },
    async fetchUsers(params?: UserQueryParams) {
      this.loading = true
      try {
        const data = await authAPI.getUsers(params)
        this.userList = data.data
        this.userPagination = data.pagination
      } finally {
        this.loading = false
      }
    },

    async updateUserRole(userId: number, role: UserRole) {
      await authAPI.updateUserRole(userId, role)
      const user = this.userList.find(u => u.user_id === userId)
      if (user) user.role = role
    },

    async deleteUser(userId: number) {
      await authAPI.deleteUser(userId)
      this.userList = this.userList.filter(u => u.user_id !== userId)
    }
  }
})