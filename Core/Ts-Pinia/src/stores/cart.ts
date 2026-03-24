import { defineStore } from "pinia";
import { useGoodsStore } from "./goods";
import { computed, ref } from "vue";
import type { CartItem } from "./types/cart";

export const useCartStore = defineStore('cart', () => {
    //state
    const items = ref<CartItem[]>([])

    //actions
    const totalPrice = computed(() => {
        const goodsStore = useGoodsStore()
        return items.value.reduce((sum, cartItems) => {
            const goods = goodsStore.goodsList.find(g => g.id === cartItems.goodsId)
            return sum + (goods ? goods.price * cartItems.quantity : 0)
        }, 0)
    })

    const addItem = (goodsId: number, quantity: number = 1) => {
        const existing = items.value.find(item => item.goodsId == goodsId)

        if (existing) {
            existing.quantity += quantity
        } else {
            items.value.push({
                goodsId,
                quantity
            })
        }
    }

    return {
        items,
        totalPrice,
        addItem
    }
})