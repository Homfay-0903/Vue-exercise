import { createRouter, createWebHistory } from "vue-router";
import { RouteNames, type AppRouteRecordRaw } from "./types";
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { setupDynamicRoutes, getUserRole, getRoutesAdded, setRoutesAdded } from './permission';
import { adminRoutes, userRoutes } from "./permission";

type Component = () => Promise<typeof import('*.vue')>

const Login: Component = () => import('../components/Login.vue')
const Home: Component = () => import('../components/Home.vue')
const LogOut: Component = () => import('../components/LogOut.vue')
const NotFound: Component = () => import('../components/404.vue')
const ProductList: Component = () => import('../components/ProductList.vue')
const ProductDetail: Component = () => import('../components/ProductDetail.vue')

const staticRoutes: AppRouteRecordRaw[] = [
    {
        path: '/login',
        name: RouteNames.Login,
        component: Login,
        meta: { title: '登录', requiresAuth: false }
    },
    {
        path: '/',
        name: RouteNames.Home,
        component: Home,
        meta: { title: '主页', requiresAuth: true }
    },
    {
        path: '/logOut',
        name: RouteNames.LogOut,
        component: LogOut,
        meta: { title: '登出', requiresAuth: false }
    },
    {
        path: '/404',
        name: RouteNames.NotFound,
        component: NotFound,
        meta: { title: '404', requiresAuth: false }
    }
]

const productRoutes: AppRouteRecordRaw[] = [
    {
        path: '/productList',
        name: RouteNames.ProductList,
        component: ProductList,
        meta: { title: '商品列表', requiresAuth: true }
    },
    {
        path: '/productDetail/:id',
        name: RouteNames.ProductDetail,
        component: ProductDetail,
        meta: { title: '商品详情', requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRoutes, ...productRoutes],

})

const getIsLogined = () => !!localStorage.getItem('token')



router.beforeEach((
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    document.title = (to.meta.title as string) || 'vue app'

    //if (getIsLogined()) {
    //    const userRole = getUserRole()
    //    if (userRole && !getRoutesAdded()) {
    //        setupDynamicRoutes(router, userRole)
    //        setRoutesAdded(true)
    //        next({ ...to, replace: true })
    //        return
    //    }
    //}
    //
    //// 如果没有匹配到任何路由，尝试在已登录时添加动态路由并重试
    //if (!to.matched || to.matched.length === 0) {
    //    if (getIsLogined()) {
    //        const userRole = getUserRole()
    //        if (userRole && !getRoutesAdded()) {
    //            setupDynamicRoutes(router, userRole)
    //            setRoutesAdded(true)
    //            next({ ...to, replace: true })
    //            return
    //        }
    //    }
    //    next({ name: RouteNames.NotFound })
    //    return
    //}

    if (to.meta.requiresAuth) {
        if (!getIsLogined()) {
            next({ name: RouteNames.Login, query: { redirect: to.fullPath } })
        } else {
            const userRole = getUserRole()
            if (userRole && !getRoutesAdded()) {
                setupDynamicRoutes(router, userRole)
                setRoutesAdded(true)
                next({ ...to, replace: true })
            } else {
                next()
            }
        }
    } else {
        next()
    }

})

export default router