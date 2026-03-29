<template>
    <div class="app-container">
        <nav class="navbar">
            <div class="nav-links">
                <router-link to="/" class="nav-link">主页</router-link>
                <router-link to="/login" class="nav-link">登录</router-link>
                <router-link to="/productList" class="nav-link">商品列表</router-link>
                <router-link to="/404" class="nav-link">404</router-link>
                <router-link to="/logOut" class="nav-link">登出</router-link>
            </div>
            <Sidebar></Sidebar>
        </nav>
        <main class="main-content">
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'

</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 2rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.nav-link {
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background-color: #e0e0e0;
}

.nav-link.router-link-active {
    color: #42b983;
    font-weight: bold;
}

.main-content {
    flex: 1;
    padding: 2rem;
}
</style>