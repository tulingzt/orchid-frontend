<!-- src/views/Register.vue -->
<template>
    <div class="auth-container">
        <el-card class="auth-box">
            <h2 class="auth-title">用户注册</h2>
            <el-form ref="registerForm" :model="form" :rules="rules" @keyup.enter="handleRegister">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="密码" prefix-icon="Lock"
                        show-password />
                </el-form-item>

                <el-form-item prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" prefix-icon="Lock"
                        show-password />
                </el-form-item>

                <el-form-item prop="role">
                    <el-radio-group v-model="form.role">
                        <el-radio label="user">普通用户</el-radio>
                        <el-radio label="admin">管理员</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="form.role === 'admin'" prop="adminSecret">
                    <el-input v-model="form.adminSecret" placeholder="管理员密钥" prefix-icon="Key" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="w-full" :loading="loading" @click="handleRegister">
                        立即注册
                    </el-button>
                </el-form-item>

                <div class="text-center">
                    <el-link type="primary" @click="$router.push('/login')">
                        已有账号？立即登录
                    </el-link>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authAPI } from '@/api/auth'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const registerForm = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin',
    adminSecret: ''
})

const validatePassword = (_: any, value: string, callback: any) => {
    if (value !== form.password) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

const validateAdminSecret = (_: any, value: string, callback: any) => {
    if (form.role === 'admin' && !value) {
        callback(new Error('管理员必须输入密钥'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' }
    ],
    adminSecret: [
        { validator: validateAdminSecret, trigger: 'blur' }
    ]
})

const handleRegister = async () => {
    try {
        await registerForm.value?.validate()
        loading.value = true

        const payload = {
            username: form.username,
            password: form.password,
            admin_secret: form.role === 'admin' ? form.adminSecret : undefined
        }
        await authAPI.register(payload)
        ElMessage.success('注册成功，请登录')
        router.push('/login')
    } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '注册失败')
    } finally {
        loading.value = false
    }
}
</script>