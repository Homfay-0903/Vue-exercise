import { createRouter, createWebHistory } from "vue-router";
import { RouteNames, type AppRouteRecordRaw } from "./types";
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const staticRoutes: AppRouteRecordRaw[] = [
    {
        path: '/login',
        name: RouteNames.Login,
        component: () => import('../components/Login.vue'),
        meta: { title: '登录', requiresAuth: false }
    },
    {
        path: '/',
        name: RouteNames.Home,
        component: () => import('../components/Home.vue'),
        meta: { title: '主页', requiresAuth: true }
    },
    {
        path: '/logOut',
        name: RouteNames.LogOut,
        component: () => import('../components/LogOut.vue'),
        meta: { title: '登出', requiresAuth: false }
    },
    {
        path: '/404',
        name: RouteNames.NotFound,
        component: () => import('../components/404.vue'),
        meta: { title: '404', requiresAuth: false }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: staticRoutes,

})

const getIsLogined = () => !!localStorage.getItem('token')

router.beforeEach((
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    document.title = (to.meta.title as string) || 'vue app'

    if (to.meta.requiresAuth) {
        if (!getIsLogined()) {
            next({ name: RouteNames.Login, query: { redirect: to.fullPath } })
        } else {
            next()
        }
    } else {
        next()
    }

})

export default router