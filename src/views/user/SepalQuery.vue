<!-- src/views/user/SepalQuery.vue -->
<template>
    <div class="sepal-query-container">
        <!-- 物种选择 -->
        <div class="species-selector mb-4">
            <span class="mr-2">选择物种：</span>
            <SpeciesSelector v-model="selectedSpeciesIds" />
        </div>

        <!-- 查询条件 -->
        <QueryFilter :filter-config="filterConfig" :initial-values="queryParams" @submit="handleSearch"
            @reset="handleReset" />

        <!-- 数据表格 -->
        <DataTable :columns="columns" :data="sepalStore.items" :total="sepalStore.pagination.total"
            :page-size="sepalStore.pagination.limit" :loading="sepalStore.loading" :showActions=false
            @page-change="handlePageChange" @size-change="handleSizeChange" />

        <!-- 错误提示 -->
        <el-alert v-if="sepalStore.error" :title="sepalStore.error" type="error" show-icon class="mt-4" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSepalStore } from '@/stores/sepal'
import SpeciesSelector from '@/components/SpeciesSelector.vue'
import QueryFilter from '@/components/QueryFilter.vue'
import DataTable from '@/components/DataTable.vue'
import type { SepalQueryParams } from '@/types/models'
import { FilterItem } from '@/components/QueryFilter.vue'

const sepalStore = useSepalStore()
const selectedSpeciesIds = ref<number[]>([])

// 查询参数
const queryParams = ref<SepalQueryParams>({
    min_length: undefined,
    max_length: undefined,
    min_width: undefined,
    max_width: undefined,
    min_area: undefined,
    max_area: undefined
})

// 表格列配置
const columns = [
    { prop: 'sepal_id', label: 'ID', width: 80 },
    { prop: 'flower_id', label: '花朵ID', width: 100 },
    { prop: 'sepal_length', label: '长度(cm)', sortable: true },
    { prop: 'sepal_width', label: '宽度(cm)', sortable: true },
    { prop: 'sepal_ratio', label: '长宽比', sortable: true },
    { prop: 'sepal_area', label: '面积(cm²)', sortable: true }
]

// 筛选器配置
const filterConfig: FilterItem[] = [
    {
        type: 'range',
        field: 'length',
        label: '萼片长度(cm)',
        minPlaceholder: '最小长度',
        maxPlaceholder: '最大长度',
        precision: 2,
        span: 12
    },
    {
        type: 'range',
        field: 'width',
        label: '萼片宽度(cm)',
        minPlaceholder: '最小宽度',
        maxPlaceholder: '最大宽度',
        precision: 2,
        span: 12
    },
    {
        type: 'range',
        field: 'area',
        label: '萼片面积(cm²)',
        minPlaceholder: '最小面积',
        maxPlaceholder: '最大面积',
        precision: 2,
        span: 12
    }
]

// 监听物种选择变化
watch(selectedSpeciesIds, () => fetchData())

// 处理搜索
const handleSearch = (params: SepalQueryParams) => {
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
    sepalStore.pagination.page = page
    fetchData()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
    sepalStore.pagination.limit = size
    fetchData()
}

// 获取数据
const fetchData = () => {
    const params = {
        ...queryParams.value,
        species_ids: selectedSpeciesIds.value,
        page: sepalStore.pagination.page,
        limit: sepalStore.pagination.limit
    }
    sepalStore.fetchItems(params)
}

// 初始加载
fetchData()
</script>

<style scoped>
.sepal-query-container {
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