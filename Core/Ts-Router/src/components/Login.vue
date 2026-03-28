<template>
    <div>
        <p>Login page</p>
        <button @click="hanleLogin">login</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const hanleLogin = () => {
    localStorage.setItem('token', '12345')
    const redirect = route.query.redirect as string || '/'
    router.push(redirect)
}
</script>

<style scoped></style>