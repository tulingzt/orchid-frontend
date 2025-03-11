// src/stores/petal.ts
import { defineStore } from 'pinia'
import { petalAPI } from '@/api/petal'
import type {
    Petal,
    PetalCreate,
    PetalQueryParams,
} from '@/types/models'

export const usePetalStore = defineStore('petal', {
    state: () => ({
        items: [] as Petal[],
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
        async fetchItems(params?: PetalQueryParams) {
            this.loading = true
            try {
                const response = await petalAPI.getMultiple({
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

        async createItem(data: PetalCreate) {
            try {
                const response = await petalAPI.create(data)
                return response.data.petal_id
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async updateItem(id: number, data: Partial<PetalCreate>) {
            try {
                await petalAPI.update(id, data)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async deleteItem(id: number) {
            try {
                await petalAPI.delete(id)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        }
    }
})