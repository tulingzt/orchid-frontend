<!-- src/views/user/PetalQuery.vue -->
<template>
  <div class="petal-query-container">
    <!-- 物种选择 -->
    <div class="species-selector mb-4">
      <span class="mr-2">选择物种：</span>
      <SpeciesSelector v-model="selectedSpeciesIds" />
    </div>

    <!-- 查询条件 -->
    <QueryFilter
      :filter-config="filterConfig"
      :initial-values="queryParams"
      @submit="handleSearch"
      @reset="handleReset"
    />

    <!-- 数据表格 -->
    <DataTable
      :columns="columns"
      :data="petalStore.items"
      :total="petalStore.pagination.total"
      :page-size="petalStore.pagination.limit"
      :loading="petalStore.loading"
      :showActions=false
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />

    <!-- 错误提示 -->
    <el-alert
      v-if="petalStore.error"
      :title="petalStore.error"
      type="error"
      show-icon
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePetalStore } from '@/stores/petal'
import SpeciesSelector from '@/components/SpeciesSelector.vue'
import QueryFilter from '@/components/QueryFilter.vue'
import DataTable from '@/components/DataTable.vue'
import type { PetalQueryParams } from '@/types/models'
import { FilterItem } from '@/components/QueryFilter.vue'

const petalStore = usePetalStore()
const selectedSpeciesIds = ref<number[]>([])

// 查询参数
const queryParams = ref<PetalQueryParams>({
  min_length: undefined,
  max_length: undefined,
  min_width: undefined,
  max_width: undefined,
  min_area: undefined,
  max_area: undefined
})

// 表格列配置
const columns = [
  { prop: 'petal_id', label: 'ID', width: 80 },
  { prop: 'flower_id', label: '花朵ID', width: 100 },
  { prop: 'petal_length', label: '长度(cm)', sortable: true },
  { prop: 'petal_width', label: '宽度(cm)', sortable: true },
  { prop: 'petal_ratio', label: '长宽比', sortable: true },
  { prop: 'petal_area', label: '面积(cm²)', sortable: true }
]

// 筛选器配置
const filterConfig: FilterItem[] = [
  {
    type: 'range',
    field: 'length',
    label: '花瓣长度(cm)',
    minPlaceholder: '最小长度',
    maxPlaceholder: '最大长度',
    precision: 2,
    span: 8
  },
  {
    type: 'range',
    field: 'width',
    label: '花瓣宽度(cm)',
    minPlaceholder: '最小宽度',
    maxPlaceholder: '最大宽度',
    precision: 2,
    span: 8
  },
  {
    type: 'range',
    field: 'area',
    label: '花瓣面积(cm²)',
    minPlaceholder: '最小面积',
    maxPlaceholder: '最大面积',
    precision: 2,
    span: 8
  }
]

// 监听物种选择变化
watch(selectedSpeciesIds, () => fetchData())

// 处理搜索
const handleSearch = (params: PetalQueryParams) => {
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
  petalStore.pagination.page = page
  fetchData()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
  petalStore.pagination.limit = size
  fetchData()
}

// 获取数据
const fetchData = () => {
  const params = {
    ...queryParams.value,
    species_ids: selectedSpeciesIds.value,
    page: petalStore.pagination.page,
    limit: petalStore.pagination.limit
  }
  petalStore.fetchItems(params)
}

// 初始加载
fetchData()
</script>

<style scoped>
.petal-query-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

.species-selector {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
</style>