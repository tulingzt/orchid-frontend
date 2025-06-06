<!-- src/components/DataTable.vue -->
<template>
    <div class="data-table-container">
        <el-table :data="data" v-loading="loading" border stripe style="width: 100%">
            <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label"
                :width="col.width" :sortable="col.sortable">
                <template #default="{ row }" v-if="col.formatter">
                    {{ col.formatter(row[col.prop!]) }}
                </template>
            </el-table-column>

            <el-table-column v-if="showActions" label="操作" width="180" fixed="right">
                <template #default="{ row }">
                    <el-button type="primary" size="small" @click="$emit('edit', row)">
                        编辑
                    </el-button>
                    <el-button type="danger" size="small" @click="$emit('delete', row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"
                @current-change="$emit('page-change', currentPage)" @size-change="$emit('size-change', $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TableColumn {
    prop?: string
    label: string
    width?: number
    sortable?: boolean
    formatter?: (value: any) => string
}

defineProps({
    columns: {
        type: Array as () => TableColumn[],
        required: true
    },
    data: {
        type: Array,
        default: () => []
    },
    total: {
        type: Number,
        default: 0
    },
    loading: Boolean,
    showActions: {
        type: Boolean,
        default: true
    },
    pageSize: {
        type: Number,
        default: 10
    }
})

const currentPage = ref(1)

defineEmits(['page-change', 'size-change', 'view', 'edit', 'delete'])
</script>

<style scoped>
.data-table-container {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.pagination-container {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
}

:deep(.el-pagination) {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px;
}
</style>