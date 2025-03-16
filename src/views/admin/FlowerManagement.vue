<!-- src/views/admin/FlowerManagement.vue -->
<template>
    <div class="management-container">
        <el-button type="primary" @click="showDialog('create')">新增花朵</el-button>
        <el-button type="success" @click="exportToExcel">导出Excel</el-button>
        <DataTable :columns="columns" :data="flowerStore.items" :total="flowerStore.pagination.total"
            :page-size="flowerStore.pagination.limit" :loading="flowerStore.loading" :show-actions="true"
            @page-change="handlePageChange" @size-change="handleSizeChange" @edit="showDialog('edit', $event)"
            @delete="handleDelete" />

        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-form :model="formData" :rules="rules" ref="formRef">
                <el-form-item label="物种ID" prop="species_id">
                    <el-input-number v-model="formData.species_id" :min="1" />
                </el-form-item>
                <el-form-item label="花朵长度(cm)" prop="flower_length">
                    <el-input-number v-model="formData.flower_length" :min="0.1" :precision="2" />
                </el-form-item>
                <el-form-item label="花朵宽度(cm)" prop="flower_width">
                    <el-input-number v-model="formData.flower_width" :min="0.1" :precision="2" />
                </el-form-item>
                <el-form-item label="花朵面积(cm²)">
                    <el-input-number v-model="formData.flower_area" :min="0.1" :precision="2" />
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
import { useFlowerStore } from '@/stores/flower'
import DataTable from '@/components/DataTable.vue'
import type { Flower, FlowerCreate } from '@/types/models'

const flowerStore = useFlowerStore()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const currentId = ref<number | null>(null)
const dialogType = ref<'create' | 'edit'>('create')

// 表格列配置
const columns = [
    { prop: 'flower_id', label: 'ID', width: 80 },
    { prop: 'species_id', label: '物种ID' },
    { prop: 'flower_length', label: '长度(cm)', width: 120 },
    { prop: 'flower_width', label: '宽度(cm)', width: 120 },
    { prop: 'flower_ratio', label: '长宽比', width: 120 },
    { prop: 'flower_area', label: '面积(cm²)', width: 120 }
]

// 表单数据
const formData = reactive<FlowerCreate>({
    species_id: 0,
    flower_length: 0,
    flower_width: 0,
    flower_area: undefined
})

// 验证规则
const rules = {
    species_id: [{ required: true, message: '请选择物种', trigger: 'blur' }],
    flower_length: [{
        required: true,
        validator: (_: any, v: number) => v > 0,
        message: '长度必须大于0',
        trigger: 'blur'
    }],
    flower_width: [{
        required: true,
        validator: (_: any, v: number) => v > 0,
        message: '宽度必须大于0',
        trigger: 'blur'
    }]
}

// 显示对话框
const showDialog = (type: 'create' | 'edit', row?: Flower) => {
    dialogType.value = type
    dialogTitle.value = type === 'create' ? '新增花朵' : '编辑花朵'
    if (type === 'edit' && row) {
        currentId.value = row.flower_id
        Object.assign(formData, {
            species_id: row.species_id,
            flower_length: row.flower_length,
            flower_width: row.flower_width,
            flower_area: row.flower_area
        })
    } else {
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
            await flowerStore.createItem(formData)
        } else if (currentId.value) {
            await flowerStore.updateItem(currentId.value, formData)
        }
        dialogVisible.value = false
        flowerStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

// 删除处理
const handleDelete = async (row: Flower) => {
    try {
        await flowerStore.deleteItem(row.flower_id)
        flowerStore.fetchItems()
    } catch (err) {
        console.error(err)
    }
}

// 处理分页变化
const handlePageChange = (page: number) => {
    flowerStore.pagination.page = page
    flowerStore.fetchItems()
}

// 处理每页数量变化
const handleSizeChange = (size: number) => {
    flowerStore.pagination.limit = size
    flowerStore.fetchItems()
}

// 导出Excel
const exportToExcel = () => {
    // 处理数据格式
    const data = flowerStore.items.map(item => {
        const row: Record<string, any> = {};
        columns.forEach(col => {
            if (col.prop === 'flower_ratio') {
                // 计算长宽比并保留两位小数
                const ratio = item.flower_length / item.flower_width;
                row[col.label] = Number(ratio.toFixed(2));
            } else {
                row[col.label] = item[col.prop as keyof Flower];
            }
        });
        return row;
    });

    // 创建工作表和工作簿
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '花朵数据');

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
    });

    // 创建Blob并保存文件
    const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `花朵数据_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

// 初始加载
flowerStore.fetchItems()
</script>