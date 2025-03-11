// src/api/sepal.ts
import axios from '@/utils/request'
import type { 
  Sepal,
  SepalCreate,
  SepalQueryParams,
  PaginatedResponse
} from '@/types/models'

export const sepalAPI = {
  // 获取萼片列表
  getMultiple(params?: SepalQueryParams) {
    const processedParams = params ? {
      ...params,
      species_ids: params.species_ids?.join(','),
    } : undefined
    return axios.get<PaginatedResponse<Sepal>>('/api/data/sepal', { 
      params: processedParams,
      paramsSerializer: {
        indexes: null // 禁用数组索引格式
      }
    })
  },

  // 获取单个萼片详情
  get(id: number) {
    return axios.get<Sepal>(`/api/data/sepal/${id}`)
  },

  // 创建新萼片记录
  create(data: SepalCreate) {
    return axios.post<{ sepal_id: number }>('/api/data/sepal', data)
  },

  // 更新萼片信息
  update(id: number, data: Partial<SepalCreate>) {
    return axios.put<Sepal>(`/api/data/sepal/${id}`, data)
  },

  // 删除萼片记录
  delete(id: number) {
    return axios.delete(`/api/data/sepal/${id}`)
  }
}