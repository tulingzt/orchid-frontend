// src/types/models.ts
/**************** 基础类型 ****************/
export type ConservationStatus = '无危' | '易危' | '濒危'
export type UserRole = 'admin' | 'user'

/**************** 核心数据模型 ****************/
export interface User {
    user_id: number
    username: string
    role: UserRole
    created_time?: string
    last_login_time?: string | null
}

export interface Species {
    species_id: number
    family: string
    genus: string
    scientific_name: string
    chinese_name: string
    distribution?: string
    conservation_status: ConservationStatus
}

export interface Flower {
    flower_id: number
    species_id: number
    flower_length: number
    flower_width: number
    flower_ratio: number
    flower_area?: number
}

export interface Petal {
    petal_id: number
    flower_id: number
    petal_length: number
    petal_width: number
    petal_ratio: number
    petal_area?: number
}

export interface Sepal {
    sepal_id: number
    flower_id: number
    sepal_length: number
    sepal_width: number
    sepal_ratio: number
    sepal_area?: number
}

/**************** 查询参数类型 ****************/
export interface UserQueryParams {
    username?: string
    role?: UserRole
}

export interface SpeciesQueryParams {
    family?: string
    genus?: string
    conservation_status?: ConservationStatus
    scientific_name?: string
    chinese_name?: string
    page?: number
    limit?: number
}

export interface FlowerQueryParams {
    species_ids?: number[]
    min_length?: number
    max_length?: number
    min_width?: number
    max_width?: number
    min_area?: number
    max_area?: number
    page?: number
    limit?: number
}

export type PetalQueryParams = FlowerQueryParams
export type SepalQueryParams = FlowerQueryParams

/**************** 响应类型 ****************/
// 分页响应类型
export interface PaginatedResponse<T> {
    code: number
    data: T[]
    pagination: {
        total: number
        page: number
        pages: number
        per_page: number
    }
}

/**************** 表单数据类型 ****************/
export interface UserCreate {
    username: string
    password: string
    admin_secret?: string
}

export interface SpeciesCreate {
    family: string
    genus: string
    scientific_name: string
    chinese_name: string
    distribution?: string
    conservation_status: ConservationStatus
}

export interface FlowerCreate {
    species_id: number
    flower_length: number
    flower_width: number
    flower_area?: number
}

export interface PetalCreate {
    flower_id: number
    petal_length: number
    petal_width: number
    petal_area?: number
}

export interface SepalCreate {
    flower_id: number
    sepal_length: number
    sepal_width: number
    sepal_area?: number
}

export type DataType = 'species' | 'flower' | 'petal' | 'sepal'

export type CreatePayloadMap = {
    species: SpeciesCreate
    flower: FlowerCreate
    petal: PetalCreate
    sepal: SepalCreate
}

export type ResponseIdMap = {
    species: { species_id: number }
    flower: { flower_id: number }
    petal: { petal_id: number }
    sepal: { sepal_id: number }
}

export type UpdatePayloadMap = {
    species: SpeciesCreate
    flower: FlowerCreate
    petal: PetalCreate
    sepal: SepalCreate
}

/**************** 认证相关类型 ****************/
export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
}

/**************** 图表数据类型 ****************/
export interface MorphologyChartData {
    name: string
    length: number
    width: number
    ratio: number
    area?: number
}

/**************** 管理操作类型 ****************/
export interface BulkOperationResult {
    success: number
    failed: number
    errors: string[]
}