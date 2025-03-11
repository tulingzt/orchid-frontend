// src/stores/species.ts
import { defineStore } from 'pinia'
import { speciesAPI } from '@/api/species'
import type {
    Species,
    SpeciesCreate,
    SpeciesQueryParams,
} from '@/types/models'

export const useSpeciesStore = defineStore('species', {
    state: () => ({
        items: [] as Species[],
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
        async fetchItems(params?: SpeciesQueryParams) {
            this.loading = true
            try {
                const response = await speciesAPI.getMultiple({
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

        async createItem(data: SpeciesCreate) {
            try {
                const response = await speciesAPI.create(data)
                return response.data.species_id
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async updateItem(id: number, data: Partial<SpeciesCreate>) {
            try {
                await speciesAPI.update(id, data)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        },

        async deleteItem(id: number) {
            try {
                await speciesAPI.delete(id)
            } catch (err) {
                throw new Error((err as Error).message)
            }
        }
    }
})