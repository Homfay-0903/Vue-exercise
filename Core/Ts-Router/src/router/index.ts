import { createRouter, createWebHistory } from "vue-router";
import { RouteNames, type AppRouteRecordRaw } from "./types";


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
        meta: { title: '主页', requiresAuth: false }
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

export default router