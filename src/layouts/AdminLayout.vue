<!-- src/layouts/AdminLayout.vue -->
<template>
    <el-container style="height: 100vh">
        <!-- 顶部导航 -->
        <el-header class="header-container">
            <el-menu mode="horizontal">
                <el-menu-item disabled class="title-item">
                    <span class="title-text">管理员面板</span>
                </el-menu-item>
                <el-menu-item>
                    <el-icon><User /></el-icon>
                    <span>{{ authStore.currentUser?.username }}</span>
                </el-menu-item>
                <el-menu-item v-if="authStore.isAdmin" @click="handleSwitchRole">
                    <el-icon><Switch /></el-icon>
                    切换面板
                </el-menu-item>
                <el-menu-item @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                </el-menu-item>
            </el-menu>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="120px">
                <el-menu router mode="vertical" :default-active="$route.path">
                    <el-menu-item index="/admin/users">用户管理</el-menu-item>
                    <el-menu-item index="/admin/species">物种管理</el-menu-item>
                    <el-menu-item index="/admin/flower">花朵管理</el-menu-item>
                    <el-menu-item index="/admin/petal">花瓣管理</el-menu-item>
                    <el-menu-item index="/admin/sepal">萼片管理</el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主内容区 -->
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

const handleSwitchRole = () => {
    console.log('切换面板')
    router.push('/user')
}
</script>