<template>
    <div>
        <nav>
            <router-link to="/">主页</router-link> |
            <router-link to="/login">登录</router-link> |
            <router-link to="/404">404</router-link> |
            <router-link to="/logOut">登出</router-link>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped></style>