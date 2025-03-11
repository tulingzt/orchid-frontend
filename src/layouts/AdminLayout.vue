<!-- src/layouts/AdminLayout.vue -->
<template>
  <el-container class="h-full">
    <!-- 顶部导航 -->
    <el-header class="flex items-center justify-between bg-white border-b">
      <div class="flex items-center gap-8">
        <span class="text-xl font-bold text-primary">管理后台</span>
        <span>{{ authStore.currentUser?.username }}</span>
        <el-button type="danger" size="small" @click="handleLogout">
          退出登录
        </el-button>
        <el-menu mode="horizontal" :default-active="$route.path" router>
          <el-menu-item index="/admin/users">用户管理</el-menu-item>
          <el-menu-item index="/admin/species">物种管理</el-menu-item>
          <el-menu-item index="/admin/flower">花朵管理</el-menu-item>
          <el-menu-item index="/admin/petal">花瓣管理</el-menu-item>
          <el-menu-item index="/admin/sepal">萼片管理</el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="bg-gray-50">
      <router-view />
    </el-main>
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
</script>