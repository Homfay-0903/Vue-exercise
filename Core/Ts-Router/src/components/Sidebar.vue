<template>
    <div class="sidebar">
        <h3>侧边栏</h3>
        <ul>
            <li v-for="route in sidebarRoutes" :key="route.name">
                <a @click="handleChange(route.name as string)">{{ route.meta?.title }}</a>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { AppRouteRecordRaw } from '../router/types';
import { RouteNames } from '../router/types';
import { getUserRole } from '../router/permission';

const router = useRouter()
const userRole = getUserRole()

// 过滤出侧边栏需要显示的路由（排除登录页和404，并根据角色过滤）
const sidebarRoutes = computed(() => {
    const routes = router.getRoutes()
    return routes.filter((route) => {
        const r = route as unknown as AppRouteRecordRaw
        if (!r.meta?.title) return false
        if (r.name === RouteNames.Login || r.name === RouteNames.NotFound) return false

        // 检查角色权限
        if (r.meta?.roles && r.meta.roles.length > 0) {
            return r.meta.roles.includes(userRole as string)
        }

        return true
    })
})

const handleChange = (name: string) => {
    router.push({ name })
}

</script>

<style scoped>
.sidebar {
    padding: 1rem;
    border-left: 1px solid #ddd;
}

.sidebar h3 {
    margin-top: 0;
    font-size: 1.2rem;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar li {
    padding: 0.5rem 0;
}

.sidebar a {
    cursor: pointer;
    color: #42b983;
    text-decoration: none;
}

.sidebar a:hover {
    text-decoration: underline;
}
</style>