<template>
    <div>
        <h3>shopping here</h3>
        <ul>
            <li v-for="goods in goodsStore.goodsList" :key="goods.id">
                <p>name is {{ goods.name }}</p>
                <p>price is {{ goods.price }}</p>
                <button @click="goodsStore.updatePrice(goods.id, goods.price + 10)">up</button>
            </li>
        </ul>
        <h3>cart here</h3>
        <button @click="cartStore.addItem(1)">add keyboard</button>
        <p>totalprice is {{ cartStore.totalPrice }}</p>
    </div>
</template>

<script setup lang="ts">
import { useGoodsStore } from '../stores/goods';
import { useCartStore } from '../stores/cart';

const goodsStore = useGoodsStore()
const cartStore = useCartStore()


</script>

<style scoped></style>