<!-- src/views/admin/UserManagement.vue -->
<template>
    <div class="management-container">
        <el-button type="primary" @click="showDialog('create')">新增用户</el-button>

        <DataTable :columns="columns" :data="userStore.userList" :total="userStore.userPagination.total"
            :page-size="userStore.userPagination.per_page" :loading="userStore.loading" :show-actions="true"
            @page-change="handlePageChange" @size-change="handleSizeChange" @edit="showDialog('edit', $event)"
            @delete="handleDelete" />

        <!-- 用户操作对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
                <el-form-item label="用户名" prop="username" v-if="isCreate">
                    <el-input v-model="formData.username" />
                    <div class="form-tip">用户名需唯一且不可重复</div>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="isCreate">
                    <el-input v-model="formData.password" type="password" show-password placeholder="至少6位字符" />
                </el-form-item>
                <el-form-item label="用户角色" prop="role">
                    <el-select v-model="formData.role">
                        <el-option label="普通用户" value="user" />
                        <el-option label="管理员" value="admin" />
                    </el-select>
                </el-form-item>
                <el-form-item label="管理员密钥" prop="admin_secret" v-if="formData.role === 'admin' && isCreate">
                    <el-input v-model="formData.admin_secret" type="password" show-password placeholder="请输入管理员注册密钥" />
                    <div class="form-tip error" v-if="secretError">
                        {{ secretError }}
                    </div>
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitting">
                    确认
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import DataTable from '@/components/DataTable.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User } from '@/types/models'

const userStore = useUserStore()
const dialogVisible = ref(false)
const formRef = ref()
const currentId = ref<number | null>(null)
const dialogType = ref<'create' | 'edit'>('create')
const secretError = ref('')
const submitting = ref(false)

const isCreate = computed(() => dialogType.value === 'create')
const dialogTitle = computed(() => isCreate.value ? '新增用户' : '编辑用户')

// 表格列配置
const columns = [
    { prop: 'user_id', label: 'ID', width: 80 },
    { prop: 'username', label: '用户名' },
    {
        prop: 'role',
        label: '角色',
        formatter: (row: String) => row == 'admin' ? '管理员' : '普通用户'
    },
    { prop: 'created_time', label: '注册时间', width: 180 }
]

// 表单数据
const formData = reactive({
    username: '',
    password: '',
    role: 'user' as 'user' | 'admin',
    admin_secret: ''
})
// 动态验证规则
const rules = computed(() => ({
    username: [{
        required: true,
        message: '请输入用户名',
        trigger: 'blur'
    }],
    password: [{
        required: isCreate.value,
        min: 6,
        message: '密码长度至少6位',
        trigger: 'blur'
    }],
    admin_secret: {
        validator: (_: any, value: string, callback: any) => {
            if (formData.role === 'admin' && isCreate.value) {
                if (!value) {
                    callback(new Error('创建管理员需要提供密钥'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }
}))

// 显示对话框
const showDialog = (type: 'create' | 'edit', row?: User) => {
    dialogType.value = type
    formRef.value?.resetFields()
    secretError.value = ''

    if (type === 'edit' && row) {
        currentId.value = row.user_id
        formData.role = row.role
    } else {
        currentId.value = null
        Object.assign(formData, {
            username: '',
            password: '',
            role: 'user',
            admin_secret: ''
        })
    }
    dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
    submitting.value = true
    secretError.value = ''

    try {
        await formRef.value.validate()

        if (dialogType.value === 'create') {
            await userStore.createUser({
                username: formData.username,
                password: formData.password,
                admin_secret: formData.role === 'admin' ? formData.admin_secret : undefined
            })
        } else if (currentId.value) {
            await userStore.updateUserRole(currentId.value, formData.role)
        }

        dialogVisible.value = false
        userStore.fetchUsers()
    } catch (err: any) {
        handleApiError(err)
    } finally {
        submitting.value = false
    }
}

// 处理API错误
const handleApiError = (err: any) => {
    const message = err.response?.data?.message || '操作失败'

    if (message.includes('admin_secret')) {
        secretError.value = '管理员密钥验证失败，请检查输入'
        formData.admin_secret = ''
    } else if (message.includes('username')) {
        ElMessage.error('用户名已存在')
    } else {
        ElMessage.error(message)
    }
}

// 删除用户
const handleDelete = async (row: User) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除用户 ${row.username} 吗？此操作不可逆！`,
            '警告',
            { type: 'warning' }
        )
        await userStore.deleteUser(row.user_id)
        userStore.fetchUsers()
    } catch (err) {
        console.error('删除取消或失败:', err)
    }
}

// 分页处理
const handlePageChange = (page: number) => {
    userStore.userPagination.page = page
    userStore.fetchUsers()
}

const handleSizeChange = (size: number) => {
    userStore.userPagination.per_page = size
    userStore.fetchUsers()
}

// 初始加载
userStore.fetchUsers()
</script>