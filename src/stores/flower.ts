// src/stores/flower.ts
import { defineStore } from 'pinia'
import { flowerAPI } from '@/api/flower'
import type {
    Flower,
    FlowerCreate,
    FlowerQueryParams,
} from '@/types/models'

export const useFlowerStore = defineStore('flower', {
    state: () => ({
        items: [] as Flower[],
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
        async fetchItems(params?: FlowerQueryParams) {
            this.loading = true
            try {
                const response = await flowerAPI.getMultiple({
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

        async createItem(data: FlowerCreate) {
            try {
                const response = await flowerAPI.create(data)
                return response.data.flower_id
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async updateItem(id: number, data: Partial<FlowerCreate>) {
            try {
                await flowerAPI.update(id, data)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async deleteItem(id: number) {
            try {
                await flowerAPI.delete(id)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        }
    }
})