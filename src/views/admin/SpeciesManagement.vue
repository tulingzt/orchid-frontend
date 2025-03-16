<!-- src/views/admin/SpeciesManagement.vue -->
<template>
    <div class="management-container">
        <el-button type="primary" @click="showDialog('create')">新增物种</el-button>
        <el-button type="success" @click="exportToExcel">导出Excel</el-button>
        <DataTable :columns="columns" :data="speciesStore.items" :total="speciesStore.pagination.total"
            :page-size="speciesStore.pagination.limit" :loading="speciesStore.loading" :show-actions="true"
            @page-change="handlePageChange" @size-change="handleSizeChange" @edit="showDialog('edit', $event)"
            @delete="handleDelete" />

        <!-- 编辑/新增对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-form :model="formData" :rules="rules" ref="formRef">
                <el-form-item label="科名" prop="family">
                    <el-input v-model="formData.family" />
                </el-form-item>
                <el-form-item label="属名" prop="genus">
                    <el-input v-model="formData.genus" />
                </el-form-item>
                <el-form-item label="学名" prop="scientific_name">
                    <el-input v-model="formData.scientific_name" />
                </el-form-item>
                <el-form-item label="中文名" prop="chinese_name">
                    <el-input v-model="formData.chinese_name" />
                </el-form-item>
                <el-form-item label="保护级别" prop="conservation_status">
                    <el-select v-model="formData.conservation_status">
                        <el-option label="无危" value="无危" />
                        <el-option label="易危" value="易危" />
                        <el-option label="濒危" value="濒危" />
                    </el-select>
                </el-form-item>
                <el-form-item label="分布信息">
                    <el-input v-model="formData.distribution" type="textarea" />
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
import { useSpeciesStore } from '@/stores/species'
import DataTable from '@/components/DataTable.vue'
import type { Species, SpeciesCreate } from '@/types/models'

const speciesStore = useSpeciesStore()
const dialogVisible = ref(false)
var dialogTitle = ref()
const formRef = ref()
const currentId = ref<number | null>(null)
const dialogType = ref<'create' | 'edit'>('create')

// 表格列配置
const columns = [
    { prop: 'species_id', label: 'ID', width: 80 },
    { prop: 'family', label: '科名' },
    { prop: 'genus', label: '属名' },
    { prop: 'scientific_name', label: '学名' },
    { prop: 'chinese_name', label: '中文名' },
    { prop: 'conservation_status', label: '保护级别' }
]

// 表单数据
const formData = reactive<SpeciesCreate>({
    family: '',
    genus: '',
    scientific_name: '',
    chinese_name: '',
    distribution: '',
    conservation_status: '无危'
})

// 验证规则
const rules = {
    family: [{ required: true, message: '请输入科名', trigger: 'blur' }],
    genus: [{ required: true, message: '请输入属名', trigger: 'blur' }],
    scientific_name: [{ required: true, message: '请输入学名', trigger: 'blur' }],
    chinese_name: [{ required: true, message: '请输入中文名', trigger: 'blur' }],
    conservation_status: [{ required: true }]
}

// 显示对话框
const showDialog = (type: 'create' | 'edit', row?: Species) => {
    dialogType.value = type
    if (type === 'edit' && row) {
        dialogTitle = ref('编辑物种')
        currentId.value = row.species_id
        formRef.value?.resetFields()
        Object.assign(formData, {
            family: row.family,
            genus: row.genus,
            scientific_name: row.scientific_name,
            chinese_name: row.chinese_name,
            distribution: row.distribution,
            conservation_status: row.conservation_status
        })
    } else {
        dialogTitle = ref('新增物种')
        currentId.value = null
        formRef.value?.resetFields()
    }
    dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
    await formRef.value.validate()
    try {
        if (dialogType.value === 'create') {
            await speciesStore.createItem(formData)
        } else if (currentId.value) {
            await speciesStore.updateItem(currentId.value, formData)
        }
        dialogVisible.value = false
        speciesStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

// 删除处理
const handleDelete = async (row: Species) => {
    try {
        await speciesStore.deleteItem(row.species_id)
        speciesStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

// 处理分页变化
const handlePageChange = (page: number) => {
    speciesStore.pagination.page = page
    speciesStore.fetchItems()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
    speciesStore.pagination.limit = size
    speciesStore.fetchItems()
}

const exportToExcel = () => {
  // 扩展导出列配置（包含分布信息）
  const exportColumns = [
    ...columns,
    { prop: 'distribution', label: '分布信息' }
  ]

  // 处理数据格式
  const data = speciesStore.items.map(item => {
    const row: Record<string, any> = {}
    exportColumns.forEach(col => {
      row[col.label] = item[col.prop as keyof Species] || '' // 处理空值情况
    })
    return row
  })

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(data)
  
  // 设置自适应列宽（根据列标题长度）
  const wscols = exportColumns.map(col => ({
    wch: Math.max(col.label.length * 2, 12) // 基础宽度为标题长度*2，最小12字符
  }))
  worksheet['!cols'] = wscols

  // 创建工作簿
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '物种数据')

  // 生成文件
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    cellStyles: true
  })

  // 保存文件
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  saveAs(blob, `物种数据_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// 初始加载
speciesStore.fetchItems()
</script>