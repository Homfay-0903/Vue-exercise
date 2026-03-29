import type { Router } from 'vue-router'
import { RouteNames } from './types'
import type { AppRouteRecordRaw } from './types'

type Component = () => Promise<typeof import('*.vue')>
const AdminPanel: Component = () => import('../components/AdminPanel.vue')
const UserProfile: Component = () => import('../components/UserProfile.vue')

// 不同角色的路由配置
export const adminRoutes: AppRouteRecordRaw[] = [
    {
        path: '/admin',
        name: RouteNames.AdminPanel,
        component: AdminPanel,
        meta: {
            title: 'Admin Panel',
            requiresAuth: true,
            roles: ['admin'],
        },
    },
]

export const userRoutes: AppRouteRecordRaw[] = [
    {
        path: '/user',
        name: RouteNames.UserProfile,
        component: UserProfile,
        meta: {
            title: 'User Profile',
            requiresAuth: true,
            roles: ['user'],
        },
    },
]

// 获取当前用户角色
export const getUserRole = (): 'admin' | 'user' | null => {
    const role = localStorage.getItem('userRole')
    return (role === 'admin' || role === 'user') ? role : null
}

// 清理动态路由
export const removeDynamicRoutes = (router: Router) => {
    const routes = router.getRoutes()
    routes.forEach((route) => {
        if (route.name === RouteNames.AdminPanel || route.name === RouteNames.UserProfile) {
            router.removeRoute(route.name as string)
        }
    })
}

// 设置动态路由
export const setupDynamicRoutes = (router: Router, role: 'admin' | 'user') => {
    const routeSToAdd = role === 'admin' ? adminRoutes : userRoutes

    routeSToAdd.forEach((route) => router.addRoute(route))
}

// 重置/读取路由添加标志（供外部模块使用）
let routesAdded = false
export const resetRoutesAdded = () => {
    routesAdded = false
}
export const getRoutesAdded = () => routesAdded
export const setRoutesAdded = (value: boolean) => {
    routesAdded = value
}