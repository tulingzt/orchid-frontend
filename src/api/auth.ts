// src/api/auth.ts
import axios from '@/utils/request'
import type {
  LoginRequest,
  LoginResponse,
  User,
  UserCreate,
  UserQueryParams,
  PaginatedResponse
} from '@/types/models'

export const authAPI = {
  // 用户注册
  register(data: UserCreate) {
    return axios.post<{ user_id: number }>('/api/auth/register', data).then(res => res.data)
  },

  // 用户登录
  login(data: LoginRequest): Promise<LoginResponse> {
    return axios.post('/api/auth/login', data).then(res => res.data)
  },

  // 更新用户角色（管理员）
  updateUserRole(userId: number, role: string) {
    return axios.put(`/api/auth/role/${userId}`, { role }).then(res => res.data)
  },

  // 删除用户（管理员）
  deleteUser(userId: number) {
    return axios.delete(`/api/auth/users/${userId}`).then(res => res.data)
  },

  // // 获取当前用户信息
  // getCurrentUser() {
  //   return axios.get<User>('/api/auth/me')
  // },

  // 查询用户列表（管理员）
  getUsers(params?: UserQueryParams) {
    const processedParams = params ? {...params} : undefined
    return axios.get<PaginatedResponse<User>>('/api/auth/users', {
      params: processedParams,
      paramsSerializer: {
        indexes: null
      }
    }).then(res => res.data)
  },

  // 刷新令牌
  refreshToken(): Promise<LoginResponse>{
    return axios.post('/api/auth/refresh').then(res => res.data)
  }
}