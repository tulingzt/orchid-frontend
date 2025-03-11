// src/api/petal.ts
import axios from '@/utils/request'
import type {
  Petal,
  PetalCreate,
  PetalQueryParams,
  PaginatedResponse
} from '@/types/models'

export const petalAPI = {
  // 获取花瓣列表
  getMultiple(params?: PetalQueryParams) {
    const processedParams = params ? {
      ...params,
      species_ids: params.species_ids?.join(','),
    } : undefined
    return axios.get<PaginatedResponse<Petal>>('/api/data/petal', {
      params: processedParams,
      paramsSerializer: {
        indexes: null
      }
    })
  },

  // 获取单个花瓣详情
  get(id: number) {
    return axios.get<Petal>(`/api/data/petal/${id}`)
  },

  // 创建新花瓣记录
  create(data: PetalCreate) {
    return axios.post<{ petal_id: number }>('/api/data/petal', data)
  },

  // 更新花瓣信息
  update(id: number, data: Partial<PetalCreate>) {
    return axios.put<Petal>(`/api/data/petal/${id}`, data)
  },

  // 删除花瓣记录
  delete(id: number) {
    return axios.delete(`/api/data/petal/${id}`)
  }
}