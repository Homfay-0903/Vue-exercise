<template>
    <div class="logout-container">
        <p>Logout page</p>
        <button @click="handleLogOut">Log Out</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { resetRoutesAdded, removeDynamicRoutes } from '../router/permission'

const router = useRouter()

const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    resetRoutesAdded()
    removeDynamicRoutes(router)
    router.push('/login')
}
</script>

<style scoped>
.logout-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
}

button {
    padding: 0.5rem 1.5rem;
    cursor: pointer;
}
</style>