// src/api/species.ts
import axios from '@/utils/request'
import type {
  Species,
  SpeciesCreate,
  SpeciesQueryParams,
  PaginatedResponse
} from '@/types/models'

export const speciesAPI = {
  // 获取物种列表
  getMultiple(params?: SpeciesQueryParams) {
    const processedParams = params ? {...params} : undefined
    return axios.get<PaginatedResponse<Species>>('/api/data/species', {
      params: processedParams,
      paramsSerializer: {
        indexes: null
      }
    })
  },

  // 获取单个物种详情
  get(id: number) {
    return axios.get<Species>(`/api/data/species/${id}`)
  },

  // 创建新物种
  create(data: SpeciesCreate) {
    return axios.post<{ species_id: number }>('/api/data/species', data)
  },

  // 更新物种信息
  update(id: number, data: Partial<SpeciesCreate>) {
    return axios.put<Species>(`/api/data/species/${id}`, data)
  },

  // 删除物种
  delete(id: number) {
    return axios.delete(`/api/data/species/${id}`)
  }
}