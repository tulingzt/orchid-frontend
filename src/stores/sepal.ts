// src/stores/sepal.ts
import { defineStore } from 'pinia'
import { sepalAPI } from '@/api/sepal'
import type {
    Sepal,
    SepalCreate,
    SepalQueryParams,
} from '@/types/models'

export const useSepalStore = defineStore('sepal', {
    state: () => ({
        items: [] as Sepal[],
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            pages: 0
        },
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchItems(params?: SepalQueryParams) {
            this.loading = true
            try {
                const response = await sepalAPI.getMultiple({
                    ...params,
                    page: this.pagination.page,
                    limit: this.pagination.limit
                })
                this.items = response.data.data
                this.pagination = {
                    page: response.data.pagination.page,
                    limit: response.data.pagination.per_page,
                    total: response.data.pagination.total,
                    pages: response.data.pagination.pages
                }
                this.error = null
            } catch (err) {
                this.error = (err as Error).message
            } finally {
                this.loading = false
            }
        },

        async createItem(data: SepalCreate) {
            try {
                const response = await sepalAPI.create(data)
                return response.data.sepal_id
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async updateItem(id: number, data: Partial<SepalCreate>) {
            try {
                await sepalAPI.update(id, data)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async deleteItem(id: number) {
            try {
                await sepalAPI.delete(id)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        }
    }
})