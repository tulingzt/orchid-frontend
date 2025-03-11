// src/api/flower.ts
import axios from '@/utils/request'
import type {
  Flower,
  FlowerCreate,
  FlowerQueryParams,
  PaginatedResponse
} from '@/types/models'

export const flowerAPI = {
  // 获取花朵列表
  getMultiple(params?: FlowerQueryParams) {
    const processedParams = params ? {
      ...params,
      species_ids: params.species_ids?.join(','),
    } : undefined
    return axios.get<PaginatedResponse<Flower>>('/api/data/flower', {
      params: processedParams,
      paramsSerializer: {
        indexes: null
      }
    })
  },

  // 获取单个花朵详情
  get(id: number) {
    return axios.get<Flower>(`/api/data/flower/${id}`)
  },

  // 创建新花朵记录
  create(data: FlowerCreate) {
    return axios.post<{ flower_id: number }>('/api/data/flower', data)
  },

  // 更新花朵信息
  update(id: number, data: Partial<FlowerCreate>) {
    return axios.put<Flower>(`/api/data/flower/${id}`, data)
  },

  // 删除花朵记录
  delete(id: number) {
    return axios.delete(`/api/data/flower/${id}`)
  }
}