<!-- src/components/QueryFilter.vue -->
<template>
    <el-form :model="formData" label-width="120px" class="query-filter" @submit.prevent="$emit('submit', formData)">
        <el-row :gutter="20">
            <el-col v-for="(item, index) in filterConfig" :xs="24" :sm="item.type === 'range' ? 24 : 12"
                :md="item.type === 'range' ? 16 : 8" :lg="item.type === 'range' ? 12 : (item.span || 6)">
                <el-form-item :label="item.label">
                    <!-- 输入框 -->
                    <el-input v-if="item.type === 'input'" v-model="formData[item.field]"
                        :placeholder="item.placeholder" clearable />

                    <!-- 选择器 -->
                    <el-select v-if="item.type === 'select'" v-model="formData[item.field]"
                        :placeholder="item.placeholder" clearable>
                        <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                    </el-select>

                    <!-- 范围选择 -->
                    <el-input-number v-if="item.type === 'range'" v-model="formData['min_' + item.field]"
                        :placeholder="item.minPlaceholder" :precision="item.precision || 2" controls-position="right" />
                    <span v-if="item.type === 'range'">-</span>
                    <el-input-number v-if="item.type === 'range'" v-model="formData['max_' + item.field]"
                        :placeholder="item.maxPlaceholder" :precision="item.precision || 2" controls-position="right" />
                </el-form-item>
            </el-col>

            <!-- 操作按钮 -->
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-row justify="end" :gutter="8">
                    <el-col :span="24" class="text-right">
                        <el-button type="primary" native-type="submit">查询</el-button>
                        <el-button @click="handleReset">重置</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface FilterItem {
    type: 'input' | 'select' | 'range'
    field: string
    label: string
    placeholder?: string
    span?: number
    options?: Array<{ label: string; value: any }>
    minPlaceholder?: string
    maxPlaceholder?: string
    precision?: number
}

const props = defineProps({
    filterConfig: {
        type: Array as () => FilterItem[],
        required: true
    },
    initialValues: {
        type: Object,
        default: () => ({})
    }
})

const formData = reactive({ ...props.initialValues })

const emit = defineEmits(['submit', 'reset'])

// 初始化默认值
watch(() => props.initialValues, (newVal) => {
    Object.assign(formData, newVal)
}, { immediate: true })

const handleReset = () => {
    Object.keys(formData).forEach(key => {
        formData[key] = undefined
    })
    emit('reset')
}
</script>

<style scoped>
.query-filter {
    padding: 20px;
    background: white;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}
</style>