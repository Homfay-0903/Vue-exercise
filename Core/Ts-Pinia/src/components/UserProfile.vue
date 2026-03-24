<template>
    <div v-if="userStore.isLogin">
        <p>welcome! {{ userStore.displayName }}</p>
        <p>your id is {{ userStore.userInfo?.id }}, accout is {{ userStore.userInfo?.account }}</p>
        <button @click="LogOut()">LogOut</button>
        <button @click="handleUpdateNickName()">updateNickName</button>
    </div>
    <div v-else>
        <p>you no login,please login</p>
        <button @click=Login()>login</button>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user';

const userStore = useUserStore()

const Login = () => {
    userStore.Login()
}
const LogOut = () => {
    userStore.LogOut()
}
const handleUpdateNickName = () => {
    const newNickName = prompt('please input your new nickname')
    if (newNickName) {
        userStore.updateNickName(newNickName)
    }
}
</script>

<style scoped></style>