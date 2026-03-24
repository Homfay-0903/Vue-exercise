<template>
    <div>
        <h3>shopping here</h3>
        <ul>
            <li v-for="goods in goodsStore.goodsList" :key="goods.id">
                <p>name is {{ goods.name }}</p>
                <p>price is {{ goods.price }}</p>
                <button @click="goodsStore.updatePrice(goods.id, goods.price + 10)">up</button>
                <button @click="cartStore.addItem(goods.name, goods.id)">add keyboard</button>
            </li>
        </ul>
        <hr>
        <h3>cart here</h3>
        <ul>
            <li v-for="item in cartStore.items" :key="item.goodsId">
                <p>you choose item is {{ item.name }} and its num is {{ item.quantity }}</p>
            </li>
        </ul>
        <p>totalprice is {{ cartStore.totalPrice }}</p>
        <hr>
        <h3>Product here</h3>
        <button @click="productStore.fetchProducts" :disabled="productStore.loading">fetch</button>
        <ul>
            <li v-for="product in productStore.products" :key="product.id">
                <p>product name is {{ product.name }}</p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useGoodsStore } from '../stores/goods';
import { useCartStore } from '../stores/cart';
import { useProductStore } from '../stores/product';

const goodsStore = useGoodsStore()
const cartStore = useCartStore()
const productStore = useProductStore()

</script>

<style scoped></style>