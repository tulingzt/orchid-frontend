// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from "@/stores/auth.ts"

// 公共路由
const publicRoutes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: () => {
            const authStore = useAuthStore()
            return authStore.isAuthenticated ?
                (authStore.isAdmin ? '/admin' : '/user') :
                '/login'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        meta: {
            title: '注册',
            requiresAuth: false
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: '页面不存在',
            requiresAuth: false
        }
    }
]

// 普通用户路由
const userRoutes: Array<RouteRecordRaw> = [
    {
        path: '/user',
        component: () => import('@/layouts/UserLayout.vue'),
        meta: { requiresAuth: false, role: 'user' },
        redirect: '/user/species',
        children: [
            {
                path: 'species',
                name: 'SpeciesQuery',
                component: () => import('@/views/user/SpeciesQuery.vue')
            },
            {
                path: 'flower',
                name: 'FlowerQuery',
                component: () => import('@/views/user/FlowerQuery.vue')
            },
            {
                path: 'petal',
                name: 'PetalQuery',
                component: () => import('@/views/user/PetalQuery.vue')
            },
            {
                path: 'sepal',
                name: 'SepalQuery',
                component: () => import('@/views/user/SepalQuery.vue')
            }
        ]
    }
]

// 管理员路由
const adminRoutes: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true, role: 'admin' },
        redirect: '/admin/users',
        children: [
            {
                path: 'users',
                name: 'UserManagement',
                component: () => import('@/views/admin/UserManagement.vue')
            },
            {
                path: 'species',
                name: 'SpeciesManagement',
                component: () => import('@/views/admin/SpeciesManagement.vue')
            },
            {
                path: 'flower',
                name: 'FlowerManagement',
                component: () => import('@/views/admin/FlowerManagement.vue')
            },
            {
                path: 'petal',
                name: 'PetalManagement',
                component: () => import('@/views/admin/PetalManagement.vue')
            },
            {
                path: 'sepal',
                name: 'SepalManagement',
                component: () => import('@/views/admin/SepalManagement.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...publicRoutes, ...userRoutes, ...adminRoutes]
})

// 路由守卫
router.beforeEach(async (to, _from) => {
    const authStore = useAuthStore()
    // 处理公开路由
    if (!to.meta.requiresAuth) {
        // 已登录用户访问登录/注册页时重定向
        if (authStore.isAuthenticated && ['/login', '/register'].includes(to.path)) {
            return authStore.userInfo?.role === 'admin' ? '/admin' : '/user'
        }
        return true
    }
    // 验证认证状态
    if (!authStore.isAuthenticated) {
        return {
            path: '/login',
            query: { redirect: to.fullPath }
        }
    }
    // 验证角色权限
    const requiredRole = to.meta.role
    if (requiredRole && authStore.userInfo?.role !== requiredRole) {
        return authStore.userInfo?.role === 'admin' ? '/admin' : '/user'
    }
    // 设置标题
    document.title = to.meta.title ?
        `${to.meta.title} | 兰花形态数据库` :
        '兰花形态数据库'
})

export default router