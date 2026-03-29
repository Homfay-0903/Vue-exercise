<template>
    <div>
        <p>商品详情</p>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
console.log(id)
</script>

<style scoped></style>