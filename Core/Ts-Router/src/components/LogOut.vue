<template>
    <div>
        <p>Logout page</p>
        <button @click="hanleLogOut">logOut</button>
    </div>
</template>

<script setup lang="ts">

const hanleLogOut = () => {
    localStorage.removeItem('token')
}
</script>

<style scoped></style>