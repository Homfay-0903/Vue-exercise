<template>
    <div class="product-overview" @click="handleJump">
        <p>商品详情, id: {{ id }}</p>
        <p>商品名称: {{ name }}</p>
        <p>商品价格: {{ price }}</p>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTypedRouterPush } from '../hooks/useRouterPush'
import { RouteNames } from '../router/types'

interface ProductOverviewProps {
    id: number
    name: string
    price: number
}

const router = useRouter()
const push = useTypedRouterPush()
const props = defineProps<ProductOverviewProps>()

const handleJump = () => {
    push(RouteNames.ProductDetail, { id: props.id });
}
</script>

<style scoped>
.product-overview {
    cursor: pointer;
    border: 1px solid red;
    margin-top: 10px;
}
</style>
