<!-- src/views/user/SpeciesQuery.vue -->
<template>
    <div class="species-query-container">
        <!-- 查询条件 -->
        <QueryFilter :filter-config="filterConfig" :initial-values="queryParams" @submit="handleSearch"
            @reset="handleReset" />

        <!-- 数据表格 -->
        <DataTable :columns="columns" :data="speciesStore.items" :total="speciesStore.pagination.total"
            :page-size="speciesStore.pagination.limit" :loading="speciesStore.loading" :showActions=false
            @page-change="handlePageChange" @size-change="handleSizeChange" />

        <!-- 错误提示 -->
        <el-alert v-if="speciesStore.error" :title="speciesStore.error" type="error" show-icon class="mt-4" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSpeciesStore } from '@/stores/species'
import QueryFilter from '@/components/QueryFilter.vue'
import DataTable from '@/components/DataTable.vue'
import type { SpeciesQueryParams, ConservationStatus } from '@/types/models'
import { FilterItem } from '@/components/QueryFilter.vue'

const speciesStore = useSpeciesStore()

// 查询参数
const queryParams = ref<SpeciesQueryParams>({
    family: '',
    genus: '',
    conservation_status: undefined,
    scientific_name: '',
    chinese_name: ''
})

// 表格列配置
const columns = [
    { prop: 'species_id', label: 'ID', width: 80 },
    { prop: 'family', label: '科名', sortable: true },
    { prop: 'genus', label: '属名', sortable: true },
    { prop: 'scientific_name', label: '学名', sortable: true },
    { prop: 'chinese_name', label: '中文名', sortable: true },
    {
        prop: 'conservation_status',
        label: '保护级别',
        formatter: (status: ConservationStatus) => {
            const statusMap = {
                '无危': '无危',
                '易危': '易危',
                '濒危': '濒危'
            }
            return statusMap[status] || '未知'
        }
    }
]

// 筛选器配置
const filterConfig: FilterItem[] = [
    {
        type: 'input',
        field: 'family',
        label: '科名',
        placeholder: '请输入科名',
        span: 6
    },
    {
        type: 'input',
        field: 'genus',
        label: '属名',
        placeholder: '请输入属名',
        span: 6
    },
    {
        type: 'select',
        field: 'conservation_status',
        label: '保护级别',
        placeholder: '请选择保护级别',
        options: [
            { label: '无危', value: '无危' },
            { label: '易危', value: '易危' },
            { label: '濒危', value: '濒危' }
        ],
        span: 6
    },
    {
        type: 'input',
        field: 'scientific_name',
        label: '学名',
        placeholder: '请输入学名',
        span: 6
    },
    {
        type: 'input',
        field: 'chinese_name',
        label: '中文名',
        placeholder: '请输入中文名',
        span: 6
    }
]

// 处理搜索
const handleSearch = (params: SpeciesQueryParams) => {
    queryParams.value = { ...params }
    fetchData()
}

// 处理重置
const handleReset = () => {
    queryParams.value = {
        family: '',
        genus: '',
        conservation_status: undefined,
        scientific_name: '',
        chinese_name: ''
    }
    fetchData()
}

// 处理分页变化
const handlePageChange = (page: number) => {
    speciesStore.pagination.page = page
    fetchData()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
    speciesStore.pagination.limit = size
    fetchData()
}

// 获取数据
const fetchData = () => {
    const params = {
        ...queryParams.value,
        // 过滤空值参数
        ...Object.fromEntries(
            Object.entries(queryParams.value).filter(([_, v]) => v !== ''))
    }
    speciesStore.fetchItems(params)
}

// 初始加载
onMounted(fetchData)
</script>

<style scoped>
.species-query-container {
    padding: 20px;
    background-color: #f5f7fa;
    min-height: calc(100vh - 120px);
}
</style>