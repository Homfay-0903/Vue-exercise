import { defineStore } from "pinia";
import { ref } from "vue";
import type { GoodsItem } from "./types/good";

export const useGoodsStore = defineStore('goods', () => {
    //state
    const goodsList = ref<GoodsItem[]>([
        { id: 1, name: 'Keyboard', price: 100 },
        { id: 2, name: 'Mouse', price: 50 }
    ])

    //action
    const updatePrice = (id: number, newPrice: number) => {
        const updateGoods = goodsList.value.find((goods) => goods.id === id)

        if (updateGoods) {
            updateGoods.price = newPrice
        }
    }

    return {
        goodsList,
        updatePrice
    }
})