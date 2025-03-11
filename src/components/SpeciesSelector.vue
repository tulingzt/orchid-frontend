<!-- src/components/SpeciesSelector.vue -->
<template>
    <el-select
      v-model="selectedIds"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="搜索并选择物种"
      :remote-method="searchSpecies"
      :loading="loading"
      @change="handleChange"
    >
      <el-option
        v-for="item in speciesOptions"
        :key="item.species_id"
        :label="itemLabel(item)"
        :value="item.species_id"
      />
      <el-pagination
        small
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :current-page="pagination.currentPage"
        @current-change="handlePageChange"
      />
    </el-select>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { speciesAPI } from '@/api/species'
  import type { Species } from '@/types/models'
  
  interface Pagination {
    currentPage: number
    pageSize: number
    total: number
  }
  
  const emit = defineEmits(['update:modelValue'])
  
  const props = defineProps<{
    modelValue: number[]
  }>()
  
  const loading = ref(false)
  const speciesOptions = ref<Species[]>([])
  const searchKeyword = ref('')
  const pagination = ref<Pagination>({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  const selectedIds = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })
  
  const itemLabel = (item: Species) => {
    return `${item.chinese_name} (${item.scientific_name})`
  }
  
  const searchSpecies = async (query = '') => {
    searchKeyword.value = query
    await fetchSpecies()
  }
  
  const handlePageChange = (page: number) => {
    pagination.value.currentPage = page
    fetchSpecies()
  }
  
  const handleChange = (value: number[]) => {
    emit('update:modelValue', value)
  }
  
  const fetchSpecies = async () => {
    try {
      loading.value = true
      const params = {
        scientific_name: searchKeyword.value,
        chinese_name: searchKeyword.value,
        page: pagination.value.currentPage,
        limit: pagination.value.pageSize
      }
      
      const response = await speciesAPI.getMultiple(params)
      speciesOptions.value = response.data.data
      pagination.value.total = response.data.pagination.total
    } finally {
      loading.value = false
    }
  }
  
  // 初始化加载
  fetchSpecies()
  </script>
  
  <style scoped>
  .el-select {
    width: 100%;
  }
  
  :deep(.el-select__tags) {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  
  .el-pagination {
    padding: 8px;
    justify-content: center;
  }
  </style>