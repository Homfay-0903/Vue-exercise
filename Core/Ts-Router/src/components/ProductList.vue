<template>
    <div>
        <p>商品列表</p>
        <ProductOverview :id="1" :name="'商品1'" :price="100" />
        <ProductOverview :id="2" :name="'商品2'" :price="200" />
    </div>
</template>

<script setup lang="ts">
import ProductOverview from './ProductOverview.vue'
</script>

<style scoped></style>