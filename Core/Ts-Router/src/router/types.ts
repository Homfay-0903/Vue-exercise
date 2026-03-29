import type { RouteMeta, RouteRecordRaw } from 'vue-router';

export interface AppRouteMeta extends RouteMeta {
    title: string
    requiresAuth?: boolean
    roles?: string[]
}

export const RouteNames = {
    Home: 'Home',
    Login: 'Login',
    LogOut: 'LogOut',
    UserProfile: 'UserProfile',
    AdminPanel: 'AdminPanel',
    ProductList: 'ProductList',
    ProductDetail: 'ProductDetail',
    NotFound: 'NotFound',
} as const
export type RouteNames = typeof RouteNames[keyof typeof RouteNames]

export type AppRouteRecordRaw = RouteRecordRaw & {
    meta?: AppRouteMeta
}