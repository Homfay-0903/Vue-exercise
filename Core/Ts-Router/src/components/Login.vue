<template>
    <div class="login-container">
        <h2>Login</h2>
        <div class="role-selector">
            <label>
                <input type="radio" v-model="selectedRole" value="admin">
                Admin
            </label>
            <label>
                <input type="radio" v-model="selectedRole" value="user">
                User
            </label>
        </div>
        <button @click="handleLogin">Login</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const selectedRole = ref<'admin' | 'user'>('user')

const handleLogin = () => {
    localStorage.setItem('token', '12345')
    localStorage.setItem('userRole', selectedRole.value)
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
}
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
}

.role-selector {
    display: flex;
    gap: 1rem;
}

.role-selector label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

button {
    padding: 0.5rem 1.5rem;
    cursor: pointer;
}
</style>