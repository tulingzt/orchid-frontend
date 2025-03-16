<!-- src/views/user/FlowerQuery.vue -->
<template>
    <div class="flower-query-container">
        <!-- 物种选择 -->
        <div class="species-selector mb-4">
            <span class="mr-2">选择物种：</span>
            <SpeciesSelector v-model="selectedSpeciesIds" />
        </div>

        <!-- 查询条件 -->
        <QueryFilter :filter-config="filterConfig" :initial-values="queryParams" @submit="handleSearch"
            @reset="handleReset" />

        <!-- 数据表格 -->
        <DataTable :columns="columns" :data="flowerStore.items" :total="flowerStore.pagination.total"
            :page-size="flowerStore.pagination.limit" :loading="flowerStore.loading" :showActions=false
            @page-change="handlePageChange" @size-change="handleSizeChange" />

        <!-- 错误提示 -->
        <el-alert v-if="flowerStore.error" :title="flowerStore.error" type="error" show-icon class="mt-4" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useFlowerStore } from '@/stores/flower'
import SpeciesSelector from '@/components/SpeciesSelector.vue'
import QueryFilter from '@/components/QueryFilter.vue'
import { FilterItem } from '@/components/QueryFilter.vue'
import DataTable from '@/components/DataTable.vue'
import type { FlowerQueryParams } from '@/types/models'

const flowerStore = useFlowerStore()
const selectedSpeciesIds = ref<number[]>([])

// 查询参数
const queryParams = ref<FlowerQueryParams>({
    min_length: undefined,
    max_length: undefined,
    min_width: undefined,
    max_width: undefined,
    min_area: undefined,
    max_area: undefined
})

// 表格列配置
const columns = [
    { prop: 'flower_id', label: 'ID', width: 80 },
    { prop: 'species_id', label: '物种ID', width: 100 },
    { prop: 'flower_length', label: '长度(cm)', sortable: true },
    { prop: 'flower_width', label: '宽度(cm)', sortable: true },
    { prop: 'flower_ratio', label: '长宽比', sortable: true },
    { prop: 'flower_area', label: '面积(cm²)', sortable: true }
]

// 筛选器配置
const filterConfig: FilterItem[] = [
    {
        type: 'range',
        field: 'length',
        label: '花朵长度(cm)',
        minPlaceholder: '最小长度',
        maxPlaceholder: '最大长度',
        precision: 2,
        span: 12
    },
    {
        type: 'range',
        field: 'width',
        label: '花朵宽度(cm)',
        minPlaceholder: '最小宽度',
        maxPlaceholder: '最大宽度',
        precision: 2,
        span: 12
    },
    {
        type: 'range',
        field: 'area',
        label: '花朵面积(cm²)',
        minPlaceholder: '最小面积',
        maxPlaceholder: '最大面积',
        precision: 2,
        span: 12
    }
]

// 监听物种选择变化
watch(selectedSpeciesIds, () => fetchData())

// 处理搜索
const handleSearch = (params: FlowerQueryParams) => {
    queryParams.value = { ...params }
    fetchData()
}

// 处理重置
const handleReset = () => {
    queryParams.value = {
        min_length: undefined,
        max_length: undefined,
        min_width: undefined,
        max_width: undefined,
        min_area: undefined,
        max_area: undefined
    }
    fetchData()
}

// 处理分页变化
const handlePageChange = (page: number) => {
    flowerStore.pagination.page = page
    fetchData()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
    flowerStore.pagination.limit = size
    fetchData()
}

// 获取数据
const fetchData = () => {
    const params = {
        ...queryParams.value,
        species_ids: selectedSpeciesIds.value,
        page: flowerStore.pagination.page,
        limit: flowerStore.pagination.limit
    }
    flowerStore.fetchItems(params)
}

// 初始加载
fetchData()
</script>

<style scoped>
.flower-query-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 120px);
}

.species-selector {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    display: flex;
    align-items: center;
    white-space: nowrap;
}
</style>