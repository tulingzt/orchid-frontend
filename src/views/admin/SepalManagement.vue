<!-- src/views/admin/SepalManagement.vue -->
<template>
    <div class="management-container">
        <el-button type="primary" @click="showDialog('create')">新增萼片</el-button>
        <el-button type="success" @click="exportToExcel">导出Excel</el-button>
        <DataTable :columns="columns" :data="sepalStore.items" :total="sepalStore.pagination.total"
            :page-size="sepalStore.pagination.limit" :loading="sepalStore.loading" :show-actions="true"
            @page-change="handlePageChange" @size-change="handleSizeChange" @edit="showDialog('edit', $event)"
            @delete="handleDelete" />

        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-form :model="formData" :rules="rules" ref="formRef">
                <el-form-item label="花朵ID" prop="flower_id">
                    <el-input-number v-model="formData.flower_id" :min="1" />
                </el-form-item>
                <el-form-item label="萼片长度(cm)" prop="sepal_length">
                    <el-input-number v-model="formData.sepal_length" :min="0.1" :precision="2" />
                </el-form-item>
                <el-form-item label="萼片宽度(cm)" prop="sepal_width">
                    <el-input-number v-model="formData.sepal_width" :min="0.1" :precision="2" />
                </el-form-item>
                <el-form-item label="萼片面积(cm²)">
                    <el-input-number v-model="formData.sepal_area" :min="0.1" :precision="2" />
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
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { ref, reactive } from 'vue'
import { useSepalStore } from '@/stores/sepal'
import DataTable from '@/components/DataTable.vue'
import type { Sepal, SepalCreate } from '@/types/models'

const sepalStore = useSepalStore()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentId = ref<number | null>(null)
const dialogType = ref<'create' | 'edit'>('create')

const columns = [
    { prop: 'sepal_id', label: 'ID', width: 80 },
    { prop: 'flower_id', label: '花朵ID' },
    { prop: 'sepal_length', label: '长度(cm)' },
    { prop: 'sepal_width', label: '宽度(cm)' },
    { prop: 'sepal_ratio', label: '长宽比' },
    { prop: 'sepal_area', label: '面积(cm²)' }
]

const formData = reactive<SepalCreate>({
    flower_id: 0,
    sepal_length: 0,
    sepal_width: 0,
    sepal_area: undefined
})

const rules = {
    flower_id: [{ required: true, message: '请选择花朵', trigger: 'blur' }],
    sepal_length: [{ required: true, message: '请输入长度', trigger: 'blur' }],
    sepal_width: [{ required: true, message: '请输入宽度', trigger: 'blur' }]
}

const showDialog = (type: 'create' | 'edit', row?: Sepal) => {
    dialogType.value = type
    dialogTitle.value = type === 'create' ? '新增萼片' : '编辑萼片'
    if (type === 'edit' && row) {
        currentId.value = row.sepal_id
        Object.assign(formData, {
            flower_id: row.flower_id,
            sepal_length: row.sepal_length,
            sepal_width: row.sepal_width,
            sepal_area: row.sepal_area
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
            await sepalStore.createItem(formData)
        } else if (currentId.value) {
            await sepalStore.updateItem(currentId.value, formData)
        }
        dialogVisible.value = false
        sepalStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

const handleDelete = async (row: Sepal) => {
    try {
        await sepalStore.deleteItem(row.sepal_id)
        sepalStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

const handlePageChange = (page: number) => {
    sepalStore.pagination.page = page
    sepalStore.fetchItems()
}

const handleSizeChange = (size: number) => {
    sepalStore.pagination.limit = size
    sepalStore.fetchItems()
}

const exportToExcel = () => {
  // 处理数据格式，添加长宽比计算
  const data = sepalStore.items.map(item => {
    const row: Record<string, any> = {}
    columns.forEach(col => {
      if (col.prop === 'sepal_ratio') {
        // 安全计算长宽比（处理除零情况）
        const ratio = item.sepal_length / item.sepal_width
        row[col.label] = Number.isFinite(ratio) ? Number(ratio.toFixed(2)) : 0
      } else {
        row[col.label] = item[col.prop as keyof Sepal]
      }
    })
    return row
  })

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(data)
  
  // 设置列宽自适应
  const wscols = columns.map(() => ({ wch: 15 }))
  worksheet['!cols'] = wscols

  // 创建工作簿并导出
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '萼片数据')
  const excelBuffer = XLSX.write(workbook, { 
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true 
  })

  // 创建并保存文件
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  })
  saveAs(blob, `萼片数据_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`)
}

sepalStore.fetchItems()
</script>