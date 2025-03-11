<!-- src/layouts/UserLayout.vue -->
<template>
  <el-container class="h-full">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="bg-gray-100 border-r">
      <div class="h-16 flex items-center px-4 border-b">
        <span class="text-xl font-bold text-primary">用户面板</span>
      </div>

      <el-menu :default-active="$route.path" router class="border-none">
        <el-menu-item index="/user/species">
          <el-icon>
            <Collection />
          </el-icon>
          <span>物种查询</span>
        </el-menu-item>
        <el-menu-item index="/user/flower">
          <el-icon>
            <Flower />
          </el-icon>
          <span>花朵查询</span>
        </el-menu-item>
        <el-menu-item index="/user/petal">
          <el-icon>
            <Opportunity />
          </el-icon>
          <span>花瓣查询</span>
        </el-menu-item>
        <el-menu-item index="/user/sepal">
          <el-icon>
            <Cherry />
          </el-icon>
          <span>萼片查询</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <el-header class="flex items-center justify-end bg-white border-b">
        <div class="flex items-center gap-4">
          <span>{{ authStore.currentUser?.username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </el-header>

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
</script>