<!-- src/views/admin/PetalManagement.vue -->
<template>
    <div class="management-container">
        <el-button type="primary" @click="showDialog('create')">新增花瓣</el-button>
        <el-button type="success" @click="exportToExcel">导出Excel</el-button>
        <DataTable :columns="columns" :data="petalStore.items" :total="petalStore.pagination.total"
            :page-size="petalStore.pagination.limit" :loading="petalStore.loading" :show-actions="true"
            @page-change="handlePageChange" @size-change="handleSizeChange" @edit="showDialog('edit', $event)"
            @delete="handleDelete" />

        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-form :model="formData" :rules="rules" ref="formRef">
                <el-form-item label="花朵ID" prop="flower_id">
                    <el-input-number v-model="formData.flower_id" :min="1" />
                </el-form-item>
                <el-form-item label="花瓣长度(cm)" prop="petal_length">
                    <el-input-number v-model="formData.petal_length" :min="0.1" :precision="2" />
                </el-form-item>
                <el-form-item label="花瓣宽度(cm)" prop="petal_width">
                    <el-input-number v-model="formData.petal_width" :min="0.1" :precision="2" />
                </el-form-item>
                <el-form-item label="花瓣面积(cm²)">
                    <el-input-number v-model="formData.petal_area" :min="0.1" :precision="2" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ref, reactive } from 'vue'
import { usePetalStore } from '@/stores/petal'
import DataTable from '@/components/DataTable.vue'
import type { Petal, PetalCreate } from '@/types/models'

const petalStore = usePetalStore()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentId = ref<number | null>(null)
const dialogType = ref<'create' | 'edit'>('create')

const columns = [
    { prop: 'petal_id', label: 'ID', width: 80 },
    { prop: 'flower_id', label: '花朵ID' },
    { prop: 'petal_length', label: '长度(cm)' },
    { prop: 'petal_width', label: '宽度(cm)' },
    { prop: 'petal_ratio', label: '长宽比' },
    { prop: 'petal_area', label: '面积(cm²)' }
]

const formData = reactive<PetalCreate>({
    flower_id: 0,
    petal_length: 0,
    petal_width: 0,
    petal_area: undefined
})

const rules = {
    flower_id: [{ required: true, message: '请选择花朵', trigger: 'blur' }],
    petal_length: [{ required: true, message: '请输入长度', trigger: 'blur' }],
    petal_width: [{ required: true, message: '请输入宽度', trigger: 'blur' }]
}

const showDialog = (type: 'create' | 'edit', row?: Petal) => {
    dialogType.value = type
    dialogTitle.value = type === 'create' ? '新增花瓣' : '编辑花瓣'
    if (type === 'edit' && row) {
        currentId.value = row.petal_id
        Object.assign(formData, {
            flower_id: row.flower_id,
            petal_length: row.petal_length,
            petal_width: row.petal_width,
            petal_area: row.petal_area
        })
    } else {
        currentId.value = null
        formRef.value?.resetFields()
    }
    dialogVisible.value = true
}

const submitForm = async () => {
    await formRef.value.validate()
    try {
        if (dialogType.value === 'create') {
            await petalStore.createItem(formData)
        } else if (currentId.value) {
            await petalStore.updateItem(currentId.value, formData)
        }
        dialogVisible.value = false
        petalStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

const handleDelete = async (row: Petal) => {
    try {
        await petalStore.deleteItem(row.petal_id)
        petalStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

const handlePageChange = (page: number) => {
    petalStore.pagination.page = page
    petalStore.fetchItems()
}

const handleSizeChange = (size: number) => {
    petalStore.pagination.limit = size
    petalStore.fetchItems()
}

const exportToExcel = () => {
    // 处理数据格式，添加长宽比计算
    const data = petalStore.items.map(item => {
        const row: Record<string, any> = {}
        columns.forEach(col => {
            if (col.prop === 'petal_ratio') {
                // 计算长宽比并保留两位小数
                const ratio = item.petal_length / item.petal_width
                row[col.label] = Number.isNaN(ratio) ? 0 : Number(ratio.toFixed(2))
            } else {
                row[col.label] = item[col.prop as keyof Petal]
            }
        })
        return row
    })

    // 创建工作表和工作簿
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '花瓣数据')

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
    })

    // 创建Blob并保存文件
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    saveAs(blob, `花瓣数据_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

petalStore.fetchItems()
</script>